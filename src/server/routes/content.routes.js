'use strict';

/**
 * @file
 * Configure main routes
 */
import express from 'express';
import https from 'https';

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

  const settingsUrl = 'https://s3-eu-west-1.amazonaws.com/uxdev-biblo-content-article/' + contentId + '/settings.json';

  // fetch page settings from AWS
  https.get(settingsUrl, (getRes) => {
    let str = '';

    getRes.on('data', (chunk) => {
      str += chunk;
    });

    getRes.on('end', () => {

      if (getRes.statusCode !== 200) {
        // TODO: send to real 404 error page
        res.status(404);
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
