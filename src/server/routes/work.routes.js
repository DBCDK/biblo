import express from 'express';
import {ensureAuthenticated} from '../middlewares/auth.middleware';

const WorkRoutes = express.Router();

function authenticate(req) {
  const profile = req.session.passport.user.profile.profile;
  if (req.session.token && req.session.token.expires > Date.now()) {
    return req.session.token.token;
  }
  const {libraryId, loanerId, pincode} = profile.favoriteLibrary;
  return req.callServiceProvider('authenticate', {
    userId: loanerId,
    password: pincode,
    libraryId: libraryId
  }).then(response => {
    req.session.token = response[0];
    req.session.save();
    return req.session.token.token;
  });
}

function order(req, pids, token) {
  const {fullName, phone, email, favoriteLibrary} = req.session.passport.user.profile.profile;

  return req.callServiceProvider('order', {
    libraryId: favoriteLibrary.libraryId,
    pids: pids,
    name: fullName,
    phone: phone,
    email: email,
    token: token
  }).then(response => response[0]);
}

WorkRoutes.post('/bestil', ensureAuthenticated, async function (req, res) {
  const pids = req.body.pid.split(',');
  try {
    const tokeninfo = (await authenticate(req));
    const orderResponse = (await order(req, pids, tokeninfo.token));
    res.json(orderResponse);
  }
  catch (err) {
    res.status(400);
    res.json({
      errors: [err.message]
    });
  }
});

WorkRoutes.get('/:pid', async function (req, res, next) {
  const logger = res.app.get('logger');
  try {
    let pid = decodeURIComponent(req.params.pid);
    let ownReview = {};
    const workResult = (await req.callServiceProvider('work', {pids: [pid]}))[0];
    if (workResult.error) {
      logger.error('An error occured while communicating with OpenPlatform', {
        endpoint: '/work',
        error: workResult.error,
        response: workResult,
        url: req.url
      });

      next(workResult.error);
    }

    if (!workResult.data) {
      logger.error('No data present in response', {
        endpoint: '/work',
        response: workResult,
        url: req.url
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
