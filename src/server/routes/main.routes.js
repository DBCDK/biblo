'use strict';

/**
 * @file
 * Configure main routes
 */
import express from 'express';
import passport from 'passport';

const MainRoutes = express.Router();

MainRoutes.get('/', (req, res) => {
  res.render('page', {
    css: ['/css/frontpage.css'],
    js: ['/js/frontpage.js']
  });
});

MainRoutes.get('/login', passport.authenticate('unilogin',
  {
    failureRedirect: '/error'
  }
), (req, res) => {
  res.redirect('/');
});

MainRoutes.get('/logout', function(req, res) {
  const logger = req.app.get('logger');
  logger.info('Logging out user', {session: req.session});

  req.logout();
  res.redirect('/');
});

MainRoutes.get('/error', (req, res) => {
  let errorMsg = 'Some error message';
  if (req.session.passportError) {
    errorMsg = req.session.passportError.message;
  }

  req.session.passportError = null;
  res.send(errorMsg);
});

export default MainRoutes;

