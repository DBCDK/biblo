'use strict';

/**
 * @file
 * Configure main routes
 */
import config from '@dbcdk/biblo-config';
import express from 'express';
import passport from 'passport';
import http from 'http';
import {ssrMiddleware} from '../middlewares/serviceprovider.middleware';
import {setReferer, redirectBackToOrigin} from '../middlewares/auth.middleware.js';

const MainRoutes = express.Router();

MainRoutes.get('/', (req, res) => {
  res.render('page', {
    css: ['/css/frontpage.css'],
    js: ['/js/frontpage.js']
  });
});

MainRoutes.get('/login', setReferer, passport.authenticate('unilogin',
  {
    failureRedirect: '/error'
  }
), redirectBackToOrigin, (req, res) => {
  res.redirect('/');
});

MainRoutes.get('/logout', function(req, res) {
  const logger = req.app.get('logger');
  logger.info('Logging out user', {session: req.session});

  req.logout();
  res.redirect('/');
});

MainRoutes.get('/error', (req, res) => {
  let errorMsg = 'Der er sket en fejl!';
  if (req.session.passportError) {
    errorMsg = req.session.passportError.message;
  }

  req.session.passportError = null;
  res.send(errorMsg);
});

MainRoutes.get('/billede/:id/:size', ssrMiddleware, (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=360000');
  req.callServiceProvider('getResizedImage', {id: req.params.id, size: req.params.size})
    .then((result) => {
      const imageUrl = config.biblo.getConfig().provider.services.community.endpoint + result[0].body.url;

      res.setHeader('Content-Type', result[0].body.type);
      http.get(imageUrl, function(result2) {
        result2.pipe(res);
      });
    })
    .catch((err) => {
      res.send(JSON.stringify({errors: [err]}));
    });
});

MainRoutes.get('/billede/:id', ssrMiddleware, (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=360000');
  req.callServiceProvider('getImage', req.params.id).then((imageObject) => {
    const imageUrl = config.biblo.getConfig().provider.services.community.endpoint + imageObject[0].body.url;

    res.setHeader('Content-Type', imageObject[0].body.type);
    http.get(imageUrl, function(result) {
      result.pipe(res);
    });
  }).catch((err) => {
    res.send(JSON.stringify({errors: [err]}));
  });
});

export default MainRoutes;

