/**
 * @file: HTTP fallback for socketcluster.
 */

import express from 'express';
import Busboy from 'busboy';
import multer from 'multer';
import {ensureAuthenticated} from '../middlewares/auth.middleware';

const ApiRoutes = express.Router();
const upload = multer({storage: multer.memoryStorage()});

ApiRoutes.post('/uploadimage', ensureAuthenticated, upload.single('image'), async function (req, res, next) {
  try {
    const logger = req.app.get('logger');
    const accessToken = req.session.passport.user.id;

    if (!req.file) {
      throw new Error('Got no file!');
    }

    const uploadRes = (await req.callServiceProvider('uploadimage', {image: req.file, accessToken}))[0];
    if (uploadRes.statusCode >= 400) {
      throw new Error('Error occurred during file upload!');
    }

    logger.info('Successfully uploaded image!');

    return res.send(JSON.stringify(uploadRes.data));
  }
  catch (err) {
    return next(err);
  }
});

/**
 * API endpoint for uploading video to AWS S3
 */
ApiRoutes.post('/uploadvideo', ensureAuthenticated, (req, res) => {

  const logger = req.app.get('logger');
  const videoInputBucket = req.config.get('ServiceProvider.aws.buckets.videoInputBucket');
  const s3 = req.app.get('s3');
  let busboy = new Busboy({headers: req.headers});

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    const pid = req.session.passport.user.profile.profile.id;
    let file_extension = filename.split('.');
    file_extension = file_extension[file_extension.length - 1];
    filename = Date.now() + '_profile_' + pid + '.' + file_extension;
    s3.upload({
      Bucket: videoInputBucket,
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
            container: videoInputBucket,
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

ApiRoutes.post('/:event', (req, res) => {
  const event = req.params.event;
  const query = req.body[0];

  // very long timeout
  let prom = req.callServiceProvider(event, query);
  prom = Array.isArray(prom) ? prom : [prom];
  Promise.all(prom).then((response) => {
    res.send(JSON.stringify(response));
  }, (error) => {
    res.send(JSON.stringify(error));
  });
});

export default ApiRoutes;
