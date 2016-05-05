import express from 'express';
import {ensureAuthenticated} from '../middlewares/auth.middleware';
import {fullProfileOnSession} from '../middlewares/data.middleware';

const WorkRoutes = express.Router();

WorkRoutes.post('/bestil', ensureAuthenticated, fullProfileOnSession, async function (req, res) {
  try {
    let pid = req.body.mediaType;
    const profile = req.session.passport.user.profile.profile;

    const libId = profile.favoriteLibrary.libraryId;
    const loanerId = profile.favoriteLibrary.loanerId;
    const pincode = profile.favoriteLibrary.pincode;

    if (!libId || !loanerId || !pincode) {
      throw new Error('Missing borrower info!');
    }

    const borrChk = (await req.callServiceProvider('borrowerCheck', {
      loanerID: loanerId,
      pincode: pincode,
      agencyID: libId
    }))[0];

    if (borrChk.data !== 'ok') {
      throw new Error(borrChk.data);
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

WorkRoutes.get('/:pid', fullProfileOnSession, async function (req, res, next) {
  try {
    let pid = decodeURIComponent(req.params.pid);
    let ownReview = {};
    const work = (await req.callServiceProvider('work', {pids: [pid]}))[0].data[0];

    let collection = work.collection;

    let ownReviewId;
    let profile = {
      userIsLoggedIn: false,
      hasFilledInProfile: false
    };

    if (req.session.passport.user) {
      profile = req.session.passport.user.profile.profile;

      if (profile && profile.favoriteLibrary && profile.favoriteLibrary.libraryId) {
        const agency = (await req.callServiceProvider('getLibraryDetails', {agencyId: profile.favoriteLibrary.libraryId}))[0].pickupAgency;
        profile.favoriteLibrary = req.session.passport.user.profile.profile.favoriteLibrary = Object.assign(profile.favoriteLibrary, {
          libraryId: agency.agencyId,
          libraryName: (Array.isArray(agency.branchShortName) ? agency.branchShortName[0] : agency.branchShortName).$value,
          libraryAddress: agency.postalAddress + ', ' + agency.postalCode + ' ' + agency.city
        });
        res.locals.profile = JSON.stringify({profile: profile, errors: []});
      }

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
    const reviewResponse = (await req.callServiceProvider('getReviews', {collection, skip, limit}));
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
  }
  catch (err) {
    next(err);
  }
});

export default WorkRoutes;
