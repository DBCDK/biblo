'use strict';

/**
 * @file
 * Configure group routes
 */

import express from 'express';
import multer from 'multer';

import {ensureUserHasProfile, ensureAuthenticated} from '../middlewares/auth.middleware';
import {fullProfileOnSession} from '../middlewares/data.middleware';
import {ssrMiddleware} from '../middlewares/serviceprovider.middleware';

let upload = multer({storage: multer.memoryStorage()});

const GroupRoutes = express.Router();

GroupRoutes.get('/opret', ensureAuthenticated, ssrMiddleware, fullProfileOnSession, ensureUserHasProfile, (req, res) => {
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

GroupRoutes.post('/opret', upload.single('group_image'), (req, res) => {
  let data = {
    status: 'INCOMPLETE'
  };

  // Do creation processing

  data.status = 'OK';
  data.redirect = '/grupper/new_id';

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
  let windowData = {
    propertyName: 'DATA',
    data: JSON.stringify(groupData).replace('\'', '\\\'')
  };
  res.render('page', {
    css: ['/css/groupdetail.css'],
    js: ['/js/groupdetail.js'],
    data: [windowData]
  });
}


/**
 * Get data for a group
 *
 * @param params
 * @param req
 * @param res
 */
function fetchGroupData(params, req, res, update = {}) {
  req.app.get('serviceProvider').trigger('getGroup', params)[0]
    .then((response) => showGroup(Object.assign(response, update), res))
    .catch(() => res.redirect('/error'));
}

/**
 * Get group view
 */
GroupRoutes.get('/:id', (req, res) => fetchGroupData(req.params, req, res));

/**
 * Add a post to a group
 */
GroupRoutes.post('/:id', (req, res) => {
  let serviceProvider = req.app.get('serviceProvider');
  const params ={
    title: ' ',
    content: req.body.content,
    groupId: req.params.id
  };
  serviceProvider.trigger('createGroupPost', params, {request: req})[0].then(() => {
    fetchGroupData(req.params, req, res, {update: 'Dit indlæg er blevet tilføjet'});
  }); // @todo handle errors
});

GroupRoutes.get('/', (req, res) => {
  let data = {};
  let windowData = {
    propertyName: 'DATA',
    data: JSON.stringify(data).replace('\'', '\\\'')
  };

  res.render('page', {
    css: [],
    js: ['/js/groups.js'],
    data: [windowData]
  });
});

export default GroupRoutes;
