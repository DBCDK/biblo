import express from 'express';
import {ensureAuthenticated} from '../middlewares/auth.middleware';
import {fullProfileOnSession} from '../middlewares/data.middleware';

const WorkRoutes = express.Router();

WorkRoutes.post('/bestil', ensureAuthenticated, fullProfileOnSession, async function(req, res) {
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

WorkRoutes.get('/:pid', fullProfileOnSession, async function(req, res, next) {
  const logger = res.app.get('logger');
  try {
    let pid = decodeURIComponent(req.params.pid);
    let ownReview = {};
    const workResult = (await req.callServiceProvider('work', {pids: [pid]}))[0];
    if (workResult.error) {
      logger.error('An error occured while communicating with OpenPlatform', {
        endpoint: 'work',
        error: workResult.error,
        response: workResult
      });

      next(workResult.error);
    }

    const work = workResult.data[0];

    let ownReviewId;
    let pids = work.collection;
    if (typeof pids === 'undefined') {
      pids = [pid];
    }

    let profile = {
      userIsLoggedIn: false,
      hasFilledInProfile: false
    };

    if (req.isAuthenticated()) {
      profile = req.session.passport.user.profile.profile;
      if (profile && profile.favoriteLibrary && profile.favoriteLibrary.libraryId) {
        const agency = (await req.callServiceProvider('getLibraryDetails', {agencyId: profile.favoriteLibrary.libraryId}))[0].pickupAgency;
        profile.favoriteLibrary = req.session.passport.user.profile.profile.favoriteLibrary = Object.assign(profile.favoriteLibrary, {
          libraryId: agency.agencyId,
          libraryName: (Array.isArray(agency.branchShortName) ? agency.branchShortName[0] : agency.branchShortName).$value,
          libraryAddress: agency.postalAddress + ', ' + agency.postalCode + ' ' + agency.city,
          pickupAllowed: agency.pickupAllowed === '1',
          temporarilyClosed: agency.temporarilyClosed === '1'
        });
        res.locals.profile = JSON.stringify({
          profile: profile,
          errors: []
        });
      }

      let reviewCheck = (await req.callServiceProvider('getOwnReview', {
        reviewownerid: profile.id,
        pids: pids
      }))[0];
      if (reviewCheck) {
        ownReview = reviewCheck.data[0];
        if (ownReview) {
          ownReviewId = ownReview.id;
        }
      }
    }

    let skip = 0;
    let limit = 10;
    const reviewResponse = (await req.callServiceProvider('getReviews', {
      pids,
      skip,
      limit
    }));
    work.id = pid;

    // setting page title
    res.locals.title = work.dcTitle && Array.isArray(work.dcTitle) ? `${work.dcTitle[0]} - Biblo.dk` : 'Biblo.dk';

    res.render('page', {
      css: ['/css/work.css'],
      js: ['/js/work.js'],
      jsonData: [JSON.stringify({
        work: work,                                            // data about the work identified by the pids
        workReviews: reviewResponse[0].data,                   // reviews filtered for the specific work
        workReviewsMeta: {
          skip: skip,
          limit: limit,
          ownReviewId: ownReviewId,                              // review of the work done by the logged in profile
          workReviewsTotalCount: reviewResponse[0].reviewsCount // count number of total reviews of work
        }
      })]
    });
  }
  catch (err) {
    next(err);
  }
});

export default WorkRoutes;
