/**
 * @file
 * Configure review routes
 */

import express from 'express';
import multer from 'multer';
import config from '@dbcdk/biblo-config';
import sanitize from 'sanitize-html';

import Busboy from 'busboy';

import {ensureAuthenticated} from '../middlewares/auth.middleware';
import {fullProfileOnSession} from '../middlewares/data.middleware';

const AMAZON_CONFIG = config.communityservice.amazon;
const upload = multer({storage: multer.memoryStorage()}).single('image');
const ReviewRoutes = express.Router();

/**
 * Creating ElasticTranscoder jobs at AWS
 *
 * @param {Object} videoData
 * @param {string} postId
 * @param {string} commentId
 * @param {string} reviewId
 * @param {Object} logger
 */
function createElasticTranscoderJob(ElasticTranscoder, videoData, postId, commentId, reviewId, logger) {
  if (postId && typeof postId !== 'string') {
    postId = postId.toString();
  }

  if (commentId && typeof commentId !== 'string') {
    commentId = commentId.toString();
  }

  if (reviewId && typeof reviewId !== 'string') {
    reviewId = reviewId.toString();
  }

  // AWS Docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticTranscoder.html#createJob-property
  const params = {
    Input: {
      Key: videoData.videofile
    },
    PipelineId: AMAZON_CONFIG.transcoding.pipelineId,
    Output: {
      Key: `${videoData.pureFileName}.mp4`,
      PresetId: AMAZON_CONFIG.transcoding.presetId,
      ThumbnailPattern: `${videoData.pureFileName}_thumb_{count}`
    },
    UserMetadata: {
      destinationContainer: AMAZON_CONFIG.buckets.videoOutputBucket,
      mimetype: 'video/mp4' // mimetype af output
    }
  };

  if (postId) {
    params.UserMetadata.postId = postId;
  }

  if (commentId) {
    params.UserMetadata.commentId = commentId;
  }

  if (reviewId) {
    params.UserMetadata.reviewId = reviewId;
  }

  ElasticTranscoder.createJob(params, (err) => {
    if (err) {
      logger.error('ElasticTranscoder job creation failed', {error: err, params: params});
    }
    else {
      logger.info('ElasticTranscoder job was successfully created', {params: params});
    }
  });
}

ReviewRoutes.get('/:id', ensureAuthenticated, fullProfileOnSession, (req, res) => {
  let id = req.params.id;
  let limit = 1; // we only expect one here
  const profile = req.session.passport.user.profile.profile;
  req.callServiceProvider('getReviews', {id, limit}).then((reviewResponse) => {
    let pid = reviewResponse[0].data[0].pid;
    req.callServiceProvider('work', {pids: [pid]}).then((workResponse) => {
      const work = workResponse[0].data[0];
      res.render('page', {
        css: ['/css/work.css'],
        js: ['/js/work.js'],
        jsonData: [JSON.stringify({
          ownReviewId: id,
          work: work,
          profile: profile,
          reviews: reviewResponse[0].data
        })]
      });
    });
  });
});


ReviewRoutes.post('/', ensureAuthenticated, function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      return;
    }

    const profile = req.session.passport.user.profile.profile;
    const logger = req.app.get('logger');
    const ElasticTranscoder = req.app.get('ElasticTranscoder');
    const image = req.file && req.file.mimetype && req.file.mimetype.indexOf('image') >= 0 && req.file || null;

    let params = {
      id: req.body.id,
      pid: req.body.pid,
      worktype: req.body.worktype,
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
        createElasticTranscoderJob(ElasticTranscoder, req.session.videoupload, null, null, response.id, logger);
      }
      res.send(response[0]);
    },
    function (response) {
      res.send(response);
    });
  });
});


/**
 * API endpoint for uploading video to AWS S3
 */
ReviewRoutes.post('/api/uploadmedia', ensureAuthenticated, (req, res) => {
  const logger = req.app.get('logger');
  const amazonConfig = req.app.get('amazonConfig');
  const s3 = req.app.get('s3');
  let busboy = new Busboy({headers: req.headers});

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    const pid = req.session.passport.user.profile.profile.id;
    let file_extension = filename.split('.');
    file_extension = file_extension[file_extension.length - 1];
    filename = Date.now() + '_profile_' + pid + '.' + file_extension;

    s3.upload({
      Bucket: amazonConfig.buckets.videoInputBucket,
      Key: filename,
      Body: file
    }, (err, data) => {
      if (err) {
        logger.error('an error occurred while uploading to s3', {error: err});
        res.sendStatus(400);
      }
      else {
        const video = mimetype && mimetype.indexOf('video') >= 0 && file || null;
        const pureFileName = filename.substring(0, filename.lastIndexOf('.'));

        if (video) {
          req.session.videoupload = {
            mimetype: mimetype,
            videofile: data.key || data.Key,
            container: amazonConfig.buckets.videoInputBucket,
            pureFileName: pureFileName
          };

          logger.info('Successfully uploaded video to AWS S3', {data});
          res.sendStatus(200);
        }
        else {
          logger.error('An error uccurred while uploading a video to AWS', {session: req.session});
          res.sendStatus(400);
        }
      }
    });
  });

  req.pipe(busboy);
});

export default ReviewRoutes;
