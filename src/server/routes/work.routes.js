/**
 * @file Work routes
 */

import express from 'express';
import {ensureAuthenticated} from '../middlewares/auth.middleware';
import {fullProfileOnSession} from '../middlewares/data.middleware';

const WorkRoutes = express.Router();

WorkRoutes.get('/:pid', ensureAuthenticated, fullProfileOnSession, (req, res) => {
  let pid = req.params.pid;
  let reviewParams = {
    filter: {
      where: {pid: pid},
      include: [
        'likes',
        {
          relation: 'video',
          scope: {
            include: [
              'resolutions'
            ]
          }
        },
        {
          relation: 'owner',
          scope: {
            include: ['image']
          }
        }
      ]
    }
  };

  const reviewsPromise = req.callServiceProvider('getReviews', reviewParams);
  const workPromise = req.callServiceProvider('work', {pids: [pid]});

  const profile = req.session.passport.user.profile.profile;

  Promise.all([workPromise, reviewsPromise]).then((responses) => {
    const workResponse = responses[0];
    const reviewsResponse = responses[1];

    // get full work object, TODO: filter this if needed
    const work = workResponse[0].data[0];
    work.id = pid;
    res.render('page', {
      css: ['/css/work.css'],
      js: ['/js/work.js'],
      jsonData: [JSON.stringify({
        work: work,
        profile: profile,
        reviews: reviewsResponse[0].data
      })]
    });
  }, (_) => { // eslint-disable-line no-unused-vars
  });

});

export default WorkRoutes;
