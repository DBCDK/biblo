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

  const contentId = parseInt(req.params.id, 10);

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
        res.send('404');
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
