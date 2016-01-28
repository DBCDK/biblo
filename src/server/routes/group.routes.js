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
  let windowData = {};

  res.render('page', {
    pagescript: 'groupcreate.js',
    pagestyles: 'groupcreate.css',
    content: '',
    data: '\'' + JSON.stringify(windowData).replace('\'', '\\\'') + '\''
  });
});

GroupRoutes.post('/opret', upload.single('droppableimagefield'), (req, res) => {
  console.log(req.file);
  console.log(req.body);

  let windowData = {};

  res.render('page', {
    pagescript: 'groupcreate.js',
    pagestyles: 'groupcreate.css',
    content: '',
    data: '\'' + JSON.stringify(windowData).replace('\'', '\\\'') + '\''
  });
});

GroupRoutes.get('/:id/rediger', (req, res) => {
  let windowData = {};

  res.render('page', {
    pagescript: 'groupedit.js',
    content: '',
    data: '\'' + JSON.stringify(windowData).replace('\'', '\\\'') + '\''
  });
});

GroupRoutes.get('/:id', (req, res) => {
  let windowData = {};

  res.render('page', {
    pagescript: 'groupdetail.js',
    content: '',
    data: '\'' + JSON.stringify(windowData).replace('\'', '\\\'') + '\''
  });
});

GroupRoutes.get('/', (req, res) => {
  let windowData = {};

  res.render('page', {
    pagescript: 'groups.js',
    content: '',
    data: '\'' + JSON.stringify(windowData).replace('\'', '\\\'') + '\''
  });
});

export default GroupRoutes;
