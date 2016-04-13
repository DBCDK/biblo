
/**
 * @file Work routes
 */

import express from 'express';

const WorkRoutes = express.Router();

WorkRoutes.get('/:id', (req, res) => {
  res.render('page', {
    css: ['/css/work.css'],
    js: ['/js/work.js'],
    jsonData: [JSON.stringify({
      work: {
        id: 42,
        title: 'Biblen'
      }
    })]
  });
});


export default WorkRoutes;
