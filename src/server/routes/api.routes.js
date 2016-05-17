/**
 * @file: HTTP fallback for socketcluster.
 */

import express from 'express';
import Busboy from 'busboy';

const ApiRoutes = express.Router();
import {ensureAuthenticated} from '../middlewares/auth.middleware';

/**
 * API endpoint for uploading video to AWS S3
 */
ApiRoutes.post('/uploadvideo', ensureAuthenticated, (req, res) => {

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
