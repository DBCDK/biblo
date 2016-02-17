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
  res.redirect(req.headers.referer);
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

MainRoutes.get('/billede/:id', ssrMiddleware, (req, res) => {
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

