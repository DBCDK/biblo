/**
 * @file
 * Configure review routes
 */

import express from 'express';
import multer from 'multer';
import sanitize from 'sanitize-html';
import {createElasticTranscoderJob} from './../utils/aws.util.js';

import {ensureAuthenticated} from '../middlewares/auth.middleware';

const upload = multer({storage: multer.memoryStorage()});
const ReviewRoutes = express.Router();

/**
 * Get information about a single review
 * (Gets the associated work info as well)
 */
ReviewRoutes.get('/:id', async function(req, res, next) {
  let id = decodeURIComponent(req.params.id);
  let limit = 1;

  const logger = res.app.get('logger');
  try {

    let reviewResult = (await req.callServiceProvider('getReviews', {id, limit}))[0];
    if (reviewResult.error) {
      logger.error('An error occured while communicating with CommunityService', {
        endpoint: '/review',
        error: reviewResult.error,
        response: reviewResult,
        url: req.url
      });

      next(reviewResult.error);
    }

    if (!reviewResult.data) {
      logger.error('No data present in response', {
        endpoint: '/review',
        response: reviewResult,
        url: req.url
      });
      next(reviewResult.error);
    }

    let pid = decodeURIComponent(reviewResult.data[0].pid);

    let workResult = (await req.callServiceProvider('work', {pids: [pid]}))[0];
    if (workResult.error) {
      logger.error('An error occured while commuunicating with OpenPlatform', {
        endpoint: '/work',
        response: workResult,
        url: req.url
      });
      next(workResult.error);
    }

    if (!workResult.data) {
      logger.error('No data present in response', {
        endpoint: '/work',
        response: workResult,
        url: req.url
      });
      next(workResult.error);
    }

    let ownReviewId;
    if (req.isAuthenticated()) {
      let profile = req.session.passport.user.profile.profile;
      if (profile && profile.favoriteLibrary && profile.favoriteLibrary.libraryId) {
        const agency = (await req.callServiceProvider('getLibraryDetails', {agencyId: profile.favoriteLibrary.libraryId}))[0].pickupAgency;
        profile.favoriteLibrary = req.session.passport.user.profile.profile.favoriteLibrary = Object.assign(profile.favoriteLibrary, {
          libraryId: agency.agencyId,
          libraryName: (Array.isArray(agency.branchShortName) ? agency.branchShortName[0] : agency.branchShortName).$value,
          libraryAddress: agency.postalAddress + ', ' + agency.postalCode + ' ' + agency.city,
          pickupAllowed: agency.pickupAllowed === '1',
          temporarilyClosed: agency.temporarilyClosed === '1'
        });
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

    let title = work.dcTitle && Array.isArray(work.dcTitle) ? `${work.dcTitle[0]} - Biblo.dk` : 'Biblo.dk';
    res.locals.title = `Anmeldelse af ${title} - Biblo.dk`;
    res.render('page', {
      css: ['/css/review.css'],
      js: ['/js/review.js'],
      jsonData: [JSON.stringify({
        work: work, // this is the associated work info
        workReviews: reviewResult.data,
        workReviewsMeta: {
          ownReviewId: ownReviewId
        }
      })]
    });
  }
  catch (err) {
    next(err);
  }
});

/**
 * Post a review
 */
ReviewRoutes.post('/', ensureAuthenticated, upload.array(), async function handlePostReview (req, res, next) {
  try {
    const profile = req.session.passport.user.profile.profile;
    const logger = req.app.get('logger');
    const amazonConfig = req.app.get('amazonConfig');
    const ElasticTranscoder = req.app.get('ElasticTranscoder');

    const params = {
      id: req.body.id,
      pid: req.body.pid,
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
      createElasticTranscoderJob(ElasticTranscoder, req.session.videoupload, null, null, createReviewResponse.data.id, logger, amazonConfig);
    }

    req.session.videoupload = null;
    res.send(createReviewResponse);
  }
  catch (error) {
    req.session.videoupload = null;
    next(error);
  }
});

export default ReviewRoutes;
