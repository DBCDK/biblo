/**
 * @file
 * Configure main routes
 */

// Libraries
import express from 'express';
import passport from 'passport';
import request from 'request';
import {config, generateSignedCloudfrontCookie} from '@dbcdk/biblo-config';

import cacheManager from 'cache-manager';
import redisStore from 'cache-manager-redis';

import {setReferer, redirectBackToOrigin, ensureUserHasProfile, ensureUserHasValidLibrary} from '../middlewares/auth.middleware.js';
import {fullProfileOnSession} from '../middlewares/data.middleware';

// React components
import ContentpageContainer from '../../client/components/ContentPage/ContentPage.component';

const MainRoutes = express.Router();
const cache = cacheManager.caching({
  store: redisStore,
  host: config.get('Redis.host'),
  port: config.get('Redis.port'),
  ttl: config.get('CacheTimes.extended'),
  db: 2
});

function getFromCache(key) {
  return new Promise((resolve, reject) => {
    cache.get(key, function cacheCallback(err, result) {
      if (err) {
        return reject(err);
      }

      return resolve(result);
    });
  });
}

MainRoutes.get('/', fullProfileOnSession, ensureUserHasProfile, ensureUserHasValidLibrary, async (req, res, next) => {
  try {
    const contentObject = (await req.callServiceProvider('getContentPage', '/frontpage'))[0].body;

    if (contentObject.message && contentObject.message.indexOf('No route found for') > -1) {
      throw new Error('Frontpage could not be found in admin');
    }
    else {
      res.locals.title = 'Biblo';

      req.writeToReduxStateTree('widgetReducer', contentObject);
      req.writeToReduxStateTree('profileReducer', {displayLogoutWarning: (req.query.logout === '1')});
      req.renderComponent(ContentpageContainer);

      return res.render('page', {
        css: ['/css/contentpage.css'],
        js: ['/js/contentpage.js']
      });
    }
  }
  catch (err) {
    next(err);
  }
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
  res.redirect('/?logout=1');
});

MainRoutes.get('/error', (req, res, next) => {
  res.locals.title = 'Fejl - Biblo.dk';
  let errorMsg = 'Der er sket en fejl!';
  if (req.session.passportError) {
    errorMsg = req.session.passportError.message;
  }

  req.session.passportError = null;
  next(errorMsg);
});

MainRoutes.get('/billede/:id/:size', async function (req, res) {
  const logger = req.app.get('logger');

  try {
    const cacheKey = `imageCache_${req.params.id}_${req.params.size}`;
    let imageResult = await getFromCache(cacheKey);
    if (!imageResult) {
      imageResult = await req.callServiceProvider('getResizedImage', {id: req.params.id, size: req.params.size});

      if (imageResult[0].body.correctSize) {
        cache.set(cacheKey, imageResult);
      }
    }

    const image = imageResult[0].body;
    const imageUrl = generateSignedCloudfrontCookie(
      `https://${config.get(`ServiceProvider.aws.cloudfrontUrls.${image.container}`)}/${image.name}`
    );

    let expires = /Expires=([0-9]+)/.exec(imageUrl); // when this url expires, in seconds since 1/1/1970
    res.setHeader('Cache-Control', `expires=${Number(expires[1]) - 60}`);

    setTimeout(() => res.redirect(imageUrl), 50);
    logger.info('got image url', {url: imageUrl});
  }
  catch (err) {
    logger.error('An error occurred while getting image!', {error: err.message});
    res.redirect('/kunne_ikke_finde_billede.png');
  }
});

MainRoutes.get('/pdf/:id', async function (req, res) {
  const logger = req.app.get('logger');

  try {
    const pdfResult = await req.callServiceProvider('getPDF', {id: req.params.id});
    const pdfUrl = generateSignedCloudfrontCookie(
      `https://${config.get(`ServiceProvider.aws.cloudfrontUrls.${pdfResult[0].body.container}`)}/${pdfResult[0].body.name}`
    );

    const expires = /Expires=([0-9]+)/.exec(pdfUrl); // when this url expires, in seconds since 1/1/1970

    setTimeout(() => request.get(pdfUrl).on('response', response => {
      response.headers['Cache-Control'] = `expires=${Number(expires[1]) - 60}`;
      response.headers['Content-Type'] = 'application/pdf';
      response.headers['Content-Disposition'] = `inline; filename="${pdfResult[0].body.name}"`;
    }).pipe(res), 50);

    logger.info('got pdf url', {url: pdfUrl});
  }
  catch (err) {
    logger.error('An error occurred while getting PDF!', {error: err.message});
    res.redirect('/error');
  }
});

export default MainRoutes;

