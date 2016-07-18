/**
 * @file: This file describes the preview routes which render widgets based on a post request.
 */

import express from 'express';
import PreviewPage from '../../client/components/WidgetContainer/PreviewPage.component';

const PreviewRoutes = express.Router();

PreviewRoutes.post('/', (req, res, next) => {
  try {
    const widgets = JSON.parse(req.body.widgets);

    req.writeToReduxStateTree('widgetReducer', {
      widgetLocations: {
        previewPage: widgets
      }
    });
    req.renderComponent(PreviewPage);

    return res.render('page', {
      css: ['/css/preview.css', '/css/search.css'],
      js: ['/js/preview.js']
    });
  }
  catch (err) {
    return next(err);
  }
});

export default PreviewRoutes;
