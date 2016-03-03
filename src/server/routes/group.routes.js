'use strict';

/**
 * @file
 * Configure group routes
 */

import express from 'express';
import multer from 'multer';

import {groupCreateForm} from '../forms/group.forms';

import {ensureUserHasProfile, ensureAuthenticated} from '../middlewares/auth.middleware';
import {fullProfileOnSession} from '../middlewares/data.middleware';

let upload = multer({storage: multer.memoryStorage()});

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

GroupRoutes.post('/opret', ensureAuthenticated, fullProfileOnSession, ensureUserHasProfile, upload.single('group_image'), async function (req, res) {
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

function fetchCommentData(callServiceProvider, posts, skip = 0, limit = 1) {
  return posts.map(post => {
    return callServiceProvider('getComments', {
      id: post.id,
      skip: skip,
      limit: limit
    }).then(comments => {
      post.comments = comments[0] || [];
      post.numberOfCommentsLoaded = limit;
      return post;
    });
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
      req.callServiceProvider('getPosts', {id: params.id, skip: 0, limit: 2})
    ]));
    const group = response[0][0];
    const posts = response[1][0];

    group.posts = (await Promise.all(fetchCommentData(req.callServiceProvider, posts)));
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
GroupRoutes.post('/content/:type', upload.single('image'), (req, res) => {
  const image = req.file && req.file.mimetype && req.file.mimetype.indexOf('image') >= 0 && req.file || null;
  let serviceProvider = req.app.get('serviceProvider');
  const params = {
    title: ' ',
    content: req.body.content,
    parentId: req.body.parentId,
    type: req.params.type,
    image
  };
  serviceProvider.trigger('createGroupContent', params, {request: req})[0].then(() => {
    res.redirect(req.body.redirect);
  });
});

GroupRoutes.get('/', (req, res) => {
  let data = {};
  let windowData = {
    propertyName: 'DATA',
    data: JSON.stringify(data).replace('\'', '\\\'')
  };

  res.render('page', {
    css: ['/css/groups.css'],
    js: ['/js/groups.js'],
    data: [windowData]
  });
});

export default GroupRoutes;
