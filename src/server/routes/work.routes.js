/**
 * @file Work routes
 */

import express from 'express';
import {ensureAuthenticated} from '../middlewares/auth.middleware';
import {fullProfileOnSession} from '../middlewares/data.middleware';

const WorkRoutes = express.Router();

WorkRoutes.get('/:pid', ensureAuthenticated, fullProfileOnSession, (req, res) => {
  let pid = req.params.pid;
  let title = 'Biblen';
  let reviewParams = {
    filter: {
      where: {pid: pid},
      include: [
        'likes',
        'image',
        'video',
        {
          relation: 'owner',
          scope: {
            include: ['image']
          }
        }]
    }
  };

  const profile = req.session.passport.user.profile.profile;
  req.callServiceProvider('getReviews', reviewParams).then(function (response) {

    res.render('page', {
      css: ['/css/work.css'],
      js: ['/js/work.js'],
      jsonData: [JSON.stringify({
        work: {
          id: pid,
          title: title
        },
        profile: profile,
        reviews: response[0].data
      })]
    });
  }, function (response) {
    console.log('getReviews failed:', response);
  });
});

export default WorkRoutes;
