/**
 * @file
 * Configure main routes
 */
import express from 'express';
import config from '@dbcdk/biblo-config';
import http from 'http';

const ContentRoutes = express.Router();

ContentRoutes.get('/:id', (req, res) => {

  // enable caching
  res.setHeader('Cache-Control', 'public, max-age=36000');

  const contentId = '' + req.params.id;

  // ensure alphanumeric and hyphens are allows in contentId
  const AlphaAndHyphenRegex = /^[a-zA-Z0-9-]+$/;
  if (contentId.search(AlphaAndHyphenRegex) === -1) {
    res.send('invalid');
  }

  const settingsUrl = config.biblo.getConfig({}).provider.services.community.endpoint +
    'api/fileContainers/uxdev-biblo-content-article/download/' +
    encodeURIComponent(contentId + '/settings.json');


  // fetch page settings from AWS
  http.get(settingsUrl, (getRes) => {
    let str = '';

    getRes.on('data', (chunk) => {
      str += chunk;
    });

    getRes.on('end', () => {

      if (getRes.statusCode !== 200) {
        // send to 404 error page
        res.status(404).render('error', {errorData: JSON.stringify({statusCode: 404})});
      }
      else {
        const articleData = JSON.parse(str);
        res.render('page', {
          css: ['/css/article.css'],
          js: ['/js/article.js'],
          jsonData: [JSON.stringify({
            articleData: articleData
          })]
        });
      }

    });

  }).end();

});

export default ContentRoutes;

export async function wildCardRoute(req, res, next) {
  try {
    const contentObject = (await req.callServiceProvider('getContentPage', req.originalUrl))[0].body;

    if (contentObject.message && contentObject.message.indexOf('No route found for') > -1) {
      throw new Error('Content page was requested but not found!');
    }
    else {
      res.locals.title = contentObject.title;

      res.render('page', {
        css: ['/css/article.css'],
        js: ['/js/article.js'],
        jsonData: [JSON.stringify({contentPageData: contentObject})]
      });
    }
  }
  catch (err) {
    next(err);
  }
}
