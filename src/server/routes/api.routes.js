/**
 * @file: HTTP fallback for socketcluster.
 */

import express from 'express';
import Busboy from 'busboy';
import multer from 'multer';
import {ensureAuthenticated} from '../middlewares/auth.middleware';
import {log} from 'dbc-node-logger';

const ApiRoutes = express.Router();
const upload = multer({storage: multer.memoryStorage()});

ApiRoutes.post('/uploadimage', ensureAuthenticated, upload.single('image'), async function (req, res, next) {
  try {
    const accessToken = req.session.passport.user.id;

    if (!req.file) {
      throw new Error('Got no file!');
    }

    const uploadRes = (await req.callServiceProvider('uploadimage', {image: req.file, accessToken}))[0];
    if (uploadRes.statusCode >= 400) {
      log.error('Error occurred during file upload!');
      throw new Error('Error occurred during file upload!');
    }

    log.info('Successfully uploaded image!');

    return res.send(JSON.stringify(uploadRes.data));
  }
  catch (err) {
    log.error(err);
    return next(err);
  }
});

/**
 * API endpoint for uploading video to AWS S3
 */
ApiRoutes.post('/uploadvideo', ensureAuthenticated, (req, res) => {
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
        log.error('an error occurred while uploading to s3', {error: err});
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

          log.info('Successfully uploaded video to AWS S3', {data});
          res.sendStatus(200);
        }
        else {
          log.error('An error uccurred while uploading a video to AWS', {session: req.session});
          res.sendStatus(400);
        }
      }
    });
  });

  req.pipe(busboy);
});

ApiRoutes.post('/uploadpdf', ensureAuthenticated, (req, res) => {
  const pdfBucket = req.config.get('ServiceProvider.aws.buckets.pdfBucket');
  const s3 = req.app.get('s3');
  let busboy = new Busboy({headers: req.headers, limits: {fileSize: 32000000}}); // 32 mb

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    let limit = false;
    file.on('limit', function() {
      limit = true;
      return res.sendStatus(413);
    });

    const uid = req.session.passport.user.profile.profile.id;
    filename = `${Date.now()}_profile_${uid}.pdf`;
    s3.upload({
      Bucket: pdfBucket,
      Key: filename,
      Body: file
    }, (err, data) => {
      // Limit has been hit!
      // Delete the file off S3
      if (limit) {
        s3.deleteObject({Bucket: pdfBucket, Key: filename}, function () {
          log.info('Deleted PDF that was too large.', {Bucket: pdfBucket, Key: filename});
        });

        return 413;
      }

      if (err) {
        log.error('An error occurred while uploading pdf to s3', {error: err});
        return res.sendStatus(400);
      }

      const pdf = mimetype && mimetype.indexOf('pdf') >= 0 && file || null;
      const pureFileName = filename.substring(0, filename.lastIndexOf('.'));

      if (pdf) {
        req.session.pdfUploads = {
          mimetype: mimetype,
          pdffile: data.key || data.Key,
          container: pdfBucket,
          pureFileName: pureFileName
        };

        log.info('Successfully uploaded pdf to s3', {data});
        return res.sendStatus(200);
      }

      log.error('An error occurred while uploading a pdf to AWS', {session: req.session});
      return res.sendStatus(400);
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
