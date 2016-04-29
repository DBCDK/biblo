import express from 'express';
import {ensureAuthenticated} from '../middlewares/auth.middleware';
import {fullProfileOnSession} from '../middlewares/data.middleware';

const WorkRoutes = express.Router();

WorkRoutes.get('/:pid', ensureAuthenticated, fullProfileOnSession, (req, res) => {
  let pid = decodeURIComponent(req.params.pid);
  const profile = req.session.passport.user.profile.profile;
  let ownReview = {};

  req.callServiceProvider('work', {pids: [pid]}).then((workResponse) => {
    const work = workResponse[0].data[0];
    let collection = work.collection;

    req.callServiceProvider('getOwnReview', {reviewownerid: profile.id, collection: collection}).then((reviewCheck) => {
      ownReview = reviewCheck[0].data[0];
      let ownReviewId;
      if (ownReview) {
        ownReviewId = ownReview.id;
      }

      let skip = 0;
      let limit = 10;
      req.callServiceProvider('getReviews', {collection, skip, limit}).then((reviewResponse) => {
        work.id = pid;
        res.render('page', {
          css: ['/css/work.css'],
          js: ['/js/work.js'],
          ownReviewId: ownReviewId,
          jsonData: [JSON.stringify({
            ownReviewId: ownReviewId,
            work: work,
            profile: profile,
            meta: reviewResponse[0].meta,
            reviews: reviewResponse[0].data
          })]
        });
      });
    });
  });
});

export default WorkRoutes;
