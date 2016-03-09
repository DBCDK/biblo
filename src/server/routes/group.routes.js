'use strict';

/**
 * @file
 * Configure group routes
 */

import express from 'express';
import multer from 'multer';
import s3 from 'multer-s3';
import * as AWS from 'aws-sdk';
import config from '@dbcdk/biblo-config';

import {groupCreateForm} from '../forms/group.forms';

import {ensureUserHasProfile, ensureAuthenticated} from '../middlewares/auth.middleware';
import {fullProfileOnSession} from '../middlewares/data.middleware';

const AMAZON_CONFIG = config.communityservice.amazon;

AWS.config.region = AMAZON_CONFIG.region;
const ElasticTranscoder = new AWS.ElasticTranscoder({
  accessKeyId: AMAZON_CONFIG.keyId,
  secretAccessKey: AMAZON_CONFIG.key
});

const upload = multer({
  storage: multer.diskStorage({
    filename: (req, file, cb) => {
      const pid = req.session.passport.user.profile.profile.id;
      cb(null, Date.now() + '_' + pid + '_' + file.originalname.replace(new RegExp(' ', 'g'), '_'));
    }
  })
});

const uploadS3 = multer({
  storage: s3({
    dirname: 'uploads',
    bucket: AMAZON_CONFIG.buckets.videoInputBucket,
    accessKeyId: AMAZON_CONFIG.keyId,
    secretAccessKey: AMAZON_CONFIG.key,
    region: AMAZON_CONFIG.region,
    filename: function(req, file, cb) {
      const pid = req.session.passport.user.profile.profile.id;
      const filename = Date.now() + '_' + pid + '_' + file.originalname.replace(new RegExp(' ', 'g'), '_');
      file.filename = filename;
      cb(null, filename);
    }
  })
});

const GroupRoutes = express.Router();

GroupRoutes.get('/opret', ensureAuthenticated, fullProfileOnSession, ensureUserHasProfile, (req, res) => {
  let data = {};
  let windowData = {
    propertyName: 'DATA',
    data: JSON.stringify(data).replace('\'', '\\\'')
  };

  res.render('page', {
    css: ['/css/groupcreate.css'],
    js: ['/js/groupcreate.js'],
    data: [windowData]
  });
});

GroupRoutes.post('/opret', ensureAuthenticated, fullProfileOnSession, ensureUserHasProfile, upload.single('group_image'), async function(req, res) {
  let data = {
    status: 'INCOMPLETE'
  };
  let errors = [];

  groupCreateForm.handle(req, {
    other(form) {
      for (let key in form.fields) {
        if (form.fields.hasOwnProperty(key)) {
          if (form.fields[key].error) {
            errors.push({
              errorMessage: form.fields[key].error,
              field: key
            });
          }
        }
      }
    }
  });

  if (!req.file) {
    errors.push({
      errorMessage: 'Husk at vælge et coverbillede!',
      field: 'group_image'
    });
  }

  if (errors.length > 0) {
    data.status = 'ERROR';
    data.errors = errors;
  }
  else {
    // request is valid
    let createRes = (await req.callServiceProvider('createGroup', {
      name: req.body['group-name'],
      description: req.body['group-description'],
      colour: req.body['group-colour-picker_colour'],
      group_image: req.file
    }))[0];

    if (createRes.status === 200) {
      data.status = 'OK';
      data.redirect = '/grupper/' + createRes.data.id;
      data.group = createRes.data;
    }
    else {
      errors.push({
        field: 'general',
        errorMessage: 'Der skete en fejl ved gruppe oprettelse, prøv igen senere!'
      });
      data.status = 'ERROR';
      data.errors = errors;
    }
  }

  if (req.xhr) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data));
  }
  else {
    let windowData = {
      propertyName: 'DATA',
      data: JSON.stringify(data).replace('\'', '\\\'')
    };

    res.render('page', {
      css: ['/css/groupcreate.css'],
      js: ['/js/groupcreate.js'],
      data: [windowData]
    });
  }
});

GroupRoutes.get('/:id/rediger', (req, res) => {
  let data = {};
  let windowData = {
    propertyName: 'DATA',
    data: JSON.stringify(data).replace('\'', '\\\'')
  };

  res.render('page', {
    css: [],
    js: ['/js/groupedit.js'],
    data: [windowData]
  });
});

/**
 * Method for showing group
 *
 * @param groupData
 * @param res
 */
function showGroup(groupData, res) {
  res.render('page', {
    css: ['/css/groupdetail.css'],
    js: ['/js/groupdetail.js'],
    jsonData: [JSON.stringify({groupData})]
  });
}

/**
 * Get data for a group
 *
 * @param params
 * @param req
 * @param res
 */
async function fetchGroupData(params, req, res, update = {}) {
  try {
    let response = (await Promise.all([
      req.callServiceProvider('getGroup', params),
      req.callServiceProvider('getPosts', {id: params.id, skip: 0, limit: 5})
    ]));
    const group = response[0][0];
    group.posts = response[1][0];
    group.numberOfPostsLoaded = group.posts.length;
    showGroup(Object.assign(group, update), res);
  }
  catch (e) {
    res.redirect('/error');
  }
}

/**
 * Get group view
 */
GroupRoutes.get('/:id', fullProfileOnSession, (req, res) => fetchGroupData(req.params, req, res));

/**
 * Add a post to a group
 */
GroupRoutes.post('/content/:type', ensureAuthenticated, upload.single('image'), async function(req, res) {
  const image = req.file && req.file.mimetype && req.file.mimetype.indexOf('image') >= 0 && req.file || null;

  let params = {
    title: ' ',
    content: req.body.content,
    parentId: req.body.parentId,
    type: req.params.type,
    image,
    id: req.body.id
  };

  if (req.session.videoupload) {
    params.video = req.session.videoupload;
  }
  req.session.videoupload = null;

  await req.callServiceProvider('createGroupContent', params, {request: req});
  res.redirect(req.body.redirect);
});

/**
 * // TODO mmj docs...
 */
GroupRoutes.post('/api/uploadmedia', ensureAuthenticated, uploadS3.single('video'), (req, res) => {
  const pureFileName = req.file.filename.substring(0, req.file.filename.lastIndexOf('.'));

  // AWS Docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElasticTranscoder.html#createJob-property
  const params = {
    Input: {
      Key: req.file.key
    },
    PipelineId: '1456826915509-r6pfck',
    Output: {
      Key: `${pureFileName}.mp4`,
      PresetId: '1351620000001-100070', // WEB-preset
      ThumbnailPattern: `${pureFileName}_thumb_{count}`
    }
  };

  ElasticTranscoder.createJob(params, (err) => {
    if (err) {
      res.status(400).send({
        status: 'NOT',
        error: err
      });
    }
    else {
      req.session.videoupload = {
        mimetype: req.file.mimetype,
        videofile: 'uploads/' + req.file.filename,
        container: 'uxdev-biblo-input-videobucket'
      };
      res.status(200).send({
        status: 'OK',
        file: req.file.filename
      });
    }
  });
});

function listGroups(groupData, res) {
  res.render('page', {
    css: ['/css/groups.css'],
    js: ['/js/groups.js'],
    jsonData: [JSON.stringify({groupData})]
  });
}

async function getGroups(params, req, res, update = {}) {
  let response = (await req.callServiceProvider('listGroups', {}))[0];
  listGroups(Object.assign(response, update), res);
}
GroupRoutes.get('/', (req, res) => getGroups(req.params, req, res));

export default GroupRoutes;
