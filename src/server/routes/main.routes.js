/**
 * @file
 * Configure main routes
 */
import config from '@dbcdk/biblo-config';
import express from 'express';
import passport from 'passport';
import http from 'http';
import {renderToString} from 'react-dom/server';

import {setReferer, redirectBackToOrigin, ensureUserHasProfile, ensureUserHasValidLibrary} from '../middlewares/auth.middleware.js';
import {wrapComponentInProvider} from '../../client/App';

import FrontpageContainer from '../../client/components/FrontPage/FrontpageContainer.component';

const MainRoutes = express.Router();

MainRoutes.get('/', ensureUserHasProfile, ensureUserHasValidLibrary, (req, res) => {
  const frontPageBucket = process.env.FRONT_PAGE_BUCKET || 'uxdev-biblo-content-frontpage'; // eslint-disable-line no-process-env
  const settingsUrl = config.biblo.getConfig({}).provider.services.community.endpoint +
    `api/fileContainers/${frontPageBucket}/download/frontpage_content.json`;

  // fetch page settings from AWS
  http.get(settingsUrl, getRes => {
    let str = '';

    getRes.on('data', chunk => {
      str += chunk;
    });

    getRes.on('end', () => {

      if (getRes.statusCode !== 200) {
        // send to 404 error page
        res.status(404);
      }
      else {
        // Parse response from S3
        const responseData = JSON.parse(str);

        // Write it into the state tree
        req.writeToReduxStateTree('widgetReducer', {widgetLocations: responseData});

        // Render the component with the new state.
        const wrapped = wrapComponentInProvider(FrontpageContainer, req.initialReduxState);
        res.render('page', {
          content: renderToString(wrapped.component),
          state: JSON.stringify(wrapped.state),
          css: ['/css/frontpage.css', '/css/search.css'],
          js: ['/js/frontpage.js']
        });
      }
    });
  }).end();
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
    res.setHeader('Cache-Control', `max-age=${expires - 10}, no-cache, no-store`);

    setTimeout(() => res.redirect(imageUrl), 50);
    logger.info('got image url', {url: imageUrl});
  }
  catch (err) {
    logger.error('An error occurred while getting image!', {error: err.message});
    res.redirect('/kunne_ikke_finde_billede.png');
  }
});

MainRoutes.get('/billede/:id', (req, res) => {
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

