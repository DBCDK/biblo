'use strict';

/**
 * @file
 * Configure group routes
 */

import express from 'express';
import multer from 'multer';

let upload = multer({storage: multer.memoryStorage()});

const GroupRoutes = express.Router();

GroupRoutes.get('/opret', (req, res) => {
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
  // console.log(req.file);
  // console.log(req.body);

  if (req.xhr) {
    let data = {
      status: 'INCOMPLETE'
    };

    // Do creation processing

    data.status = 'OK';
    data.redirect = '/grupper/new_id';

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data));
  }
  else {
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

GroupRoutes.get('/:id', (req, res) => {
  let data = {};
  let windowData = {
    propertyName: 'DATA',
    data: JSON.stringify(data).replace('\'', '\\\'')
  };

  res.render('page', {
    css: [],
    js: ['/js/groupdetail.js'],
    data: [windowData]
  });
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
