/**
 * @file
 * Configure review routes
 */

import express from 'express';
import multer from 'multer';
import sanitize from 'sanitize-html';
import {createElasticTranscoderJob} from './../utils/aws.util.js';

import {ensureAuthenticated} from '../middlewares/auth.middleware';
import {fullProfileOnSession} from '../middlewares/data.middleware';

const upload = multer({storage: multer.memoryStorage()}).single('image');
const ReviewRoutes = express.Router();

/**
 * Get information about a single review
 * (Gets the associated work info as well)
 */
ReviewRoutes.get('/:id', fullProfileOnSession, (req, res) => {
  let id = req.params.id;
  let limit = 1; // we only expect one here

  req.callServiceProvider('getReviews', {id, limit}).then((reviewResponse) => {
    let pid = decodeURIComponent(reviewResponse[0].data[0].pid);

    req.callServiceProvider('work', {pids: [pid]}).then(async function (workResponse) {
      let ownReviewId;
      if (req.isAuthenticated()) {
        let profile = req.session.passport.user.profile.profile;
        let reviewCheck = (await req.callServiceProvider('getOwnReview', {reviewownerid: profile.id, pids: [pid]}));
        if (reviewCheck) {
          let ownReview = reviewCheck[0].data[0];
          if (ownReview) {
            ownReviewId = ownReview.id;
          }
        }
      }

      const work = workResponse[0].data[0];
      res.locals.title = `Anmeldelse af ${work.dcTitle[0]} - Biblo.dk`;
      res.render('page', {
        css: ['/css/review.css'],
        js: ['/js/review.js'],
        jsonData: [JSON.stringify({
          work: work, // this is the associated work info
          workReviews: reviewResponse[0].data,
          workReviewsMeta: {
            ownReviewId: ownReviewId
          }
        })]
      });
    });
  });
});

/**
 * Post a review
 */
ReviewRoutes.post('/', ensureAuthenticated, function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      return;
    }

    const profile = req.session.passport.user.profile.profile;
    const logger = req.app.get('logger');
    const amazonConfig = req.app.get('amazonConfig');
    const ElasticTranscoder = req.app.get('ElasticTranscoder');
    const image = req.file && req.file.mimetype && req.file.mimetype.indexOf('image') >= 0 && req.file || null;

    let params = {
      id: req.body.id,
      pid: req.body.pid,
      worktype: req.body.worktype,
      imageRemoveId: req.body.imageRemoveId,
      content: sanitize(req.body.content, {allowedTags: []}) || ' ',
      rating: req.body.rating,
      image: image,
      reviewownerid: profile.id,
      libraryid: profile.favoriteLibrary.libraryId
    };

    if (req.session.videoupload) {
      params.video = req.session.videoupload;
    }

    req.callServiceProvider('createReview', params).then(function (response) {
      if (response[0].status === 200 && req.session.videoupload) {
        createElasticTranscoderJob(ElasticTranscoder,
            req.session.videoupload, null, null, response[0].data.id, logger, amazonConfig);
      }

      req.session.videoupload = null;
      res.send(response[0]);
    },
    function (response) {
      req.session.videoupload = null;
      res.send(response);
    });
  });
});

export default ReviewRoutes;
