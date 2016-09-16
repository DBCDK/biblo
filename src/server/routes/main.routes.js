/**
 * @file
 * Configure main routes
 */

// Libraries
import express from 'express';
import passport from 'passport';
import {config, generateSignedCloudfrontCookie} from '@dbcdk/biblo-config';

import {setReferer, redirectBackToOrigin, ensureUserHasProfile, ensureUserHasValidLibrary} from '../middlewares/auth.middleware.js';
import {fullProfileOnSession} from '../middlewares/data.middleware';

// React components
import ContentpageContainer from '../../client/components/ContentPage/ContentPage.component';

const MainRoutes = express.Router();

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
    const imageResults = await req.callServiceProvider('getResizedImage', {id: req.params.id, size: req.params.size});
    const imageUrl = generateSignedCloudfrontCookie(
      `https://${config.get(`ServiceProvider.aws.cloudfrontUrls.${imageResults[0].body.container}`)}/${imageResults[0].body.name}`
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

export default MainRoutes;

