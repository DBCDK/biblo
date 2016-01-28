'use strict';

import express from 'express';

/**
 * @file
 * Configure main routes
 */
const MainRoutes = express.Router();

MainRoutes.get('/', (req, res) => {
  res.render('page', {
    css: ['/css/frontpage.css'],
    js: ['/js/frontpage.js']
  });
});

export default MainRoutes;
