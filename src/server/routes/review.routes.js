/**
 * @file
 * Configure review routes
 */

import express from 'express';
import multer from 'multer';
import sanitize from 'sanitize-html';
import {createElasticTranscoderJob} from './../utils/aws.util.js';
import {log} from 'dbc-node-logger';

import {ensureAuthenticated} from '../middlewares/auth.middleware';

const upload = multer({storage: multer.memoryStorage()});
const ReviewRoutes = express.Router();
const ReviewsRoutes = express.Router();

ReviewsRoutes.get('/', async function(req, res) {
  res.locals.title = 'Anmeldelser - Biblo.dk';
  res.render('page', {
    css: ['/css/reviewexplorer.css'],
    js: ['/js/reviewexplorer.js'],
    jsonData: []
  });
});

/**
 * Get information about a single review
 * (Gets the associated work info as well)
 */
ReviewRoutes.get('/:id', async function(req, res, next) {
  let id = decodeURIComponent(req.params.id);
  let limit = 1;
  const reviewsLimit = 10;
  const skip = 0;

  try {
    let reviewResult = (await req.callServiceProvider('getReviews', {id, limit}))[0];
    if (reviewResult.error) {
      log.error('An error occured while communicating with CommunityService', {
        endpoint: '/review',
        error: reviewResult.error,
        response: reviewResult,
        url: req.url
      });

      next(reviewResult.error);
    }

    if (!reviewResult.data) {
      log.error('No data present in response', {
        endpoint: '/review',
        response: reviewResult,
        url: req.url
      });
      next(reviewResult.error);
    }

    let pid = decodeURIComponent(reviewResult.data[0].pid);

    let workResult = (await req.callServiceProvider('work', {pids: [pid]}))[0];
    if (workResult.error) {
      log.error('An error occured while commuunicating with OpenPlatform', {
        endpoint: '/work',
        response: workResult,
        url: req.url
      });
      next(workResult.error);
    }

    if (!workResult.data) {
      log.error('No data present in response', {
        endpoint: '/work',
        response: workResult,
        url: req.url
      });
      next(workResult.error);
    }

    const reviewWhere = {
      id: {neq: id},
      markedAsDeleted: null,
      pid
    };

    const reviewsResult = (await req.callServiceProvider('getReviews', {
      where: reviewWhere,
      skip: skip,
      limit: reviewsLimit
    }))[0];

    let ownReviewId;
    if (req.isAuthenticated()) {
      let profile = req.session.passport.user.profile.profile;
      if (profile && profile.favoriteLibrary && profile.favoriteLibrary.libraryId) {
        const agency = (await req.callServiceProvider('getLibraryDetails', {
          agencyId: profile.favoriteLibrary.libraryId
        }))[0].pickupAgency;
        profile.favoriteLibrary = req.session.passport.user.profile.profile.favoriteLibrary = Object.assign(
          profile.favoriteLibrary,
          {
            libraryId: agency.agencyId,
            libraryName: (Array.isArray(agency.branchShortName) ? agency.branchShortName[0] : agency.branchShortName)
              .$value,
            libraryAddress: agency.postalAddress + ', ' + agency.postalCode + ' ' + agency.city,
            pickupAllowed: agency.pickupAllowed === '1',
            temporarilyClosed: agency.temporarilyClosed === '1'
          }
        );
        res.locals.profile = JSON.stringify({
          profile: profile,
          errors: []
        });
      }

      let reviewCheck = (await req.callServiceProvider('getOwnReview', {reviewownerid: profile.id, pids: [pid]}))[0];
      if (reviewCheck) {
        let ownReview = reviewCheck.data[0];
        if (ownReview) {
          ownReviewId = ownReview.id;
        }
      }
    }

    const work = workResult.data[0];
    work.id = pid;

    let highlightedReview;
    if (reviewResult.data && reviewResult.data.length) {
      highlightedReview = reviewResult.data[0];
    }

    res.locals.title = 'Anmeldelse af ' + (work.dcTitle ? work.dcTitle : 'Titel mangler') + ' - Biblo.dk';
    res.render('page', {
      css: ['/css/review.css'],
      js: ['/js/review.js'],
      jsonData: [
        JSON.stringify({
          work: work, // this is the associated work info
          workReviews: reviewsResult.data,
          highlightedReview: highlightedReview,
          workReviewsMeta: {
            skip: skip,
            limit: reviewsLimit,
            ownReviewId: ownReviewId,
            workReviewsTotalCount: reviewsResult.reviewsCount,
            reviewPage: true
          }
        })
      ]
    });
  } catch (err) {
    next(err);
  }
});

/**
 * Post a review
 */
ReviewRoutes.post('/', ensureAuthenticated, upload.array(), async function handlePostReview(req, res, next) {
  try {
    const profile = req.session.passport.user.profile.profile;
    const amazonConfig = req.config.get('ServiceProvider.aws');
    const ElasticTranscoder = req.app.get('ElasticTranscoder');

    const params = {
      id: req.body.id,
      pid: req.body.pid,
      created: req.body.created,
      worktype: req.body.worktype,
      imageRemoveId: req.body.imageRemoveId,
      content: sanitize(req.body.content, {allowedTags: []}) || ' ',
      rating: req.body.rating,
      imageId: req.body.imageId,
      reviewownerid: req.body.reviewownerid || profile.id,
      libraryid: profile.favoriteLibrary.libraryId
    };

    if (req.session.videoupload) {
      params.video = req.session.videoupload;
    }

    const createReviewResponse = (await req.callServiceProvider('createReview', params))[0];
    if (createReviewResponse.status === 200 && req.session.videoupload) {
      createElasticTranscoderJob(
        ElasticTranscoder,
        req.session.videoupload,
        null,
        null,
        createReviewResponse.data.id,
        amazonConfig
      );
    }

    if (
      createReviewResponse.status === 500 &&
      createReviewResponse.data &&
      createReviewResponse.data.error &&
      createReviewResponse.data.error.message === 'Eksisterende anmeldelse'
    ) {
      // find the existing review id from an existing review of a pid for the given review owner id
      const existingReviewResponse = await req.callServiceProvider('getReviews', {
        markedAsDeleted: null,
        pid: params.pid,
        reviewownerid: params.reviewownerid
      });
      createReviewResponse.data.error.existingReviewId = existingReviewResponse[0].data[0].id;
    }

    req.session.videoupload = null;
    res.status(createReviewResponse.status);
    res.send(createReviewResponse);
  } catch (error) {
    req.session.videoupload = null;
    next(error);
  }
});

export {ReviewRoutes, ReviewsRoutes};
