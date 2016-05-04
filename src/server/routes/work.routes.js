import express from 'express';
import {ensureAuthenticated} from '../middlewares/auth.middleware';
import {fullProfileOnSession} from '../middlewares/data.middleware';

const WorkRoutes = express.Router();

WorkRoutes.post('/bestil', ensureAuthenticated, fullProfileOnSession, async function (req, res) {
  let pid = req.body.mediaType;
  const profile = req.session.passport.user.profile.profile;

  try {
    const libId = profile.favoriteLibrary.libraryId;
    const loanerId = profile.favoriteLibrary.loanerId;

    if (!libId || !loanerId) {
      throw new Error('Missing borrower info!');
    }

    let orderReponse = (await req.callServiceProvider('placeOrder', {
      agencyId: libId,
      pids: pid,
      loanerId
    }))[0];

    if (!orderReponse.orderPlaced || orderReponse.errors && orderReponse.errors.length > 0) {
      throw new Error('The order could not be placed!');
    }

    res.json(orderReponse);
  }
  catch (err) {
    res.status(400);
    res.json({
      errors: [err.message]
    });
  }
});

WorkRoutes.get('/:pid', function getWorkRoute(req, res) {
  let pid = decodeURIComponent(req.params.pid);
  let ownReview = {};

  req.callServiceProvider('work', {pids: [pid]}).then(async function getWork(workResponse) {
    const work = workResponse[0].data[0];
    let collection = work.collection;

    let profile = {
      userIsLoggedIn: false,
      hasFilledInProfile: false
    };
    let ownReviewId;
    if (req.session.passport.user) {
      profile = req.session.passport.user.profile.profile;
      let reviewCheck = (await req.callServiceProvider('getOwnReview', {reviewownerid: profile.id, collection: collection}))[0];
      if (reviewCheck) {
        ownReview = reviewCheck.data[0];
        if (ownReview) {
          ownReviewId = ownReview.id;
        }
      }
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
          reviewsCount: reviewResponse[0].reviewsCount,
          reviews: reviewResponse[0].data
        })]
      });
    });
  });
});

export default WorkRoutes;
