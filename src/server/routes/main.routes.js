/**
 * @file
 * Configure main routes
 */

// Libraries
import express from 'express';
import passport from 'passport';
import request from 'request';

import {setReferer, redirectBackToOrigin, ensureUserHasProfile, ensureUserHasValidLibrary} from '../middlewares/auth.middleware.js';
import {fullProfileOnSession} from '../middlewares/data.middleware';

// React components
import FrontpageContainer from '../../client/components/FrontPage/FrontpageContainer.component';

const MainRoutes = express.Router();

MainRoutes.get('/', fullProfileOnSession, ensureUserHasProfile, ensureUserHasValidLibrary, (req, res, next) => {
  const frontPageBucket = process.env.FRONT_PAGE_BUCKET || 'uxdev-biblo-content-frontpage'; // eslint-disable-line no-process-env
  const bibloCSUrl = req.app.get('BIBLO_CONFIG').provider.services.community.endpoint;
  const settingsUrl = `${bibloCSUrl}api/fileContainers/${frontPageBucket}/download/frontpage_content.json`;

  request.get(settingsUrl, (e, d) => {
    if (e) {
      return next(e);
    }

    // Parse the widget data from S3
    const resp = JSON.parse(d.body);

    // Write it into the state tree, and render the component.
    req.writeToReduxStateTree('widgetReducer', {widgetLocations: resp});
    req.renderComponent(FrontpageContainer);

    return res.render('page', {
      css: ['/css/frontpage.css', '/css/search.css'],
      js: ['/js/frontpage.js']
    });
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
  const amazonConfig = req.app.get('amazonConfig');
  const logger = req.app.get('logger');

  try {
    let imageResults = await req.callServiceProvider('getResizedImage', {id: req.params.id, size: req.params.size});
    let imageUrl = amazonConfig.generateSignedCloudfrontCookie(
      `https://${amazonConfig.cloudfrontUrls[imageResults[0].body.container]}/${imageResults[0].body.name}`
    );

    let expires = /Expires=([0-9]+)/.exec(imageUrl); // when this url expires, in seconds since 1/1/1970
    res.setHeader('Cache-Control', `max-age=${Number(expires[1]) - 60}`);

    setTimeout(() => res.redirect(imageUrl), 50);
    logger.info('got image url', {url: imageUrl});
  }
  catch (err) {
    logger.error('An error occurred while getting image!', {error: err.message});
    res.redirect('/kunne_ikke_finde_billede.png');
  }
});

export default MainRoutes;

