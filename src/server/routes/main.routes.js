'use strict';

import express from 'express';

/**
 * @file
 * Configure main routes
 */
const MainRoutes = express.Router();

MainRoutes.get('/', (req, res) => {
  res.render('frontpage');
});

export default MainRoutes;
