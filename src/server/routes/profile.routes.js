/**
 * @file
 * Configure profile routes
 */

import express from 'express';
import multer from 'multer';

import {
  ensureUserHasProfile,
  ensureAuthenticated,
  redirectBackToOrigin,
  ensureUserHasValidLibrary
} from '../middlewares/auth.middleware';

let upload = multer({storage: multer.memoryStorage()});

const ProfileRoutes = express.Router();

function getAgencyName(agency) {
  if (Array.isArray(agency.branchName)) {
    return agency.branchName[0].$value;
  }
  return agency.branchName.$value;
}

async function checkUserLibraryInfo(req, b, p) {
  let errors = [];
  let updatedProfileObject = {};

  if (
    typeof b.libraryId === 'string' && b.libraryId.length > 0 &&
    typeof b.loanerId === 'string' && b.loanerId.length > 0 &&
    typeof b.pincode === 'string' && b.pincode.length > 0
  ) {
    const borrChk = (await req.callServiceProvider('borrowerCheck', {
      loanerID: b.loanerId,
      pincode: b.pincode,
      agencyID: b.libraryId
    }))[0];

    if (borrChk.data === 'ok') {
      updatedProfileObject.favoriteLibrary = {
        libraryId: b.libraryId,
        pincode: b.pincode,
        loanerId: b.loanerId
      };
    }
    else if (borrChk.data === 'borrower_not_found') {
      errors.push({
        field: 'loanerId',
        errorMessage: 'Forkert lånernummer eller pinkode!'
      });
    }
    else {
      errors.push({
        field: 'loanerId',
        errorMessage: 'Der er sket en fejl! Prøv igen senere!'
      });
    }
  }
  else if (
    typeof b.libraryId === 'string' &&
    b.libraryId.length > 0 ||
    typeof b.libraryId === 'number' &&
    b.libraryId > 0
  ) {
    if ((p.favoriteLibrary || {}).libraryId !== b.libraryId) {
      updatedProfileObject.favoriteLibrary = {
        libraryId: b.libraryId
      };
    }
  }
  else {
    errors.push({
      field: 'libraryId',
      errorMessage: 'Du skal vælge et bibliotek!'
    });
  }

  return {errors, updatedProfileObject};
}


ProfileRoutes.get('/rediger/bibliotek', ensureAuthenticated, function (req, res) {
  res.locals.title = 'Rediger bibliotek - Biblo.dk';
  res.render('page', {
    css: ['/css/profileeditlibrary.css'],
    js: ['/js/profileeditlibrary.js']
  });
});

ProfileRoutes.post('/rediger/bibliotek', ensureAuthenticated, async function (req, res, next) {
  try {
    let p = req.session.passport.user.profile.profile;
    const b = req.body;

    const libraryCheck = await checkUserLibraryInfo(req, b, p);

    if (libraryCheck.errors && libraryCheck.errors.length > 0) {
      return res.render('page', {
        css: ['/css/profileeditlibrary.css'],
        js: ['/js/profileeditlibrary.js'],
        jsonData: [JSON.stringify(libraryCheck)]
      });
    }

    const result = (await req.callServiceProvider('updateProfile', libraryCheck.updatedProfileObject))[0];
    if (result.error && result.error.length > 0) {
      return res.render('page', {
        css: ['/css/profileeditlibrary.css'],
        js: ['/js/profileeditlibrary.js'],
        jsonData: [JSON.stringify(result)]
      });
    }

    req.session.passport.user.profile.profile = Object.assign({}, p, result.data);
    return res.redirect(req.session.returnUrl || '/');
  }
  catch (e) {
    return next(e);
  }
});

ProfileRoutes.get(['/rediger', '/rediger/moderator/:id'], ensureAuthenticated, async function (req, res, next) {
  res.locals.title = 'Rediger profil - Biblo.dk';
  try {
    let p = req.session.passport.user.profile.profile;

    let fullProfile = {};
    if (p.isModerator && req.params.id) {
      fullProfile = (await req.callServiceProvider('getFullProfile', {
        isModerator: p.isModerator,
        id: req.params.id
      }))[0].body;
    }
    else {
      fullProfile = (await req.callServiceProvider('getFullProfile', {
        isModerator: false,
        id: p.id
      }))[0].body;
    }

    /* Mock agency object, for debugging on the go :)
     agency = agency || {
     agencyId: 'DK-775100',
     branchName: [{$value: 'bob'}],
     postalAddress: 'bob2',
     postalCode: 'bob3',
     city: 'bob4'
     };
     */


    // fetch library details and attach to favorite library
    if (fullProfile && fullProfile.favoriteLibrary && fullProfile.favoriteLibrary.libraryId) {
      const agency = (await req.callServiceProvider('getLibraryDetails', {agencyId: fullProfile.favoriteLibrary.libraryId}))[0].pickupAgency;
      fullProfile.favoriteLibrary = {
        libraryId: agency.agencyId,
        libraryName: getAgencyName(agency), // see github #22
        libraryAddress: agency.postalAddress + ', ' + agency.postalCode + ' ' + agency.city
      };
    }

    res.locals.profile = JSON.stringify({profile: fullProfile, errors: []});

    res.render('page', {
      css: ['/css/profileedit.css'],
      js: ['/js/profileedit.js']
    });
  }
  catch (e) {
    next(e);
  }
});

ProfileRoutes.post(['/rediger', '/rediger/moderator/:id'], ensureAuthenticated, upload.single('profile_image'),
  async function editProfilePost(req, res, next) {
    try {
      let p = req.session.passport.user.profile.profile;
      const requester = p;

      if (p.isModerator && req.params.id) {
        p = (await req.callServiceProvider('getFullProfile', {
          isModerator: p.isModerator,
          id: req.params.id
        }))[0].body;
      }
      else {
        p = (await req.callServiceProvider('getFullProfile', {
          isModerator: false,
          id: p.id
        }))[0].body;
      }

      // fetch library details and attach to favorite library
      if (p && p.favoriteLibrary && p.favoriteLibrary.libraryId) {
        const agency = (await req.callServiceProvider('getLibraryDetails', {agencyId: p.favoriteLibrary.libraryId}))[0].pickupAgency;
        if (agency) {
          p.favoriteLibrary = {
            libraryId: agency.agencyId,
            libraryName: getAgencyName(agency),
            libraryAddress: agency.postalAddress + ', ' + agency.postalCode + ' ' + agency.city
          };
        }
      }

      const b = req.body;
      let updatedProfileObject = {};
      let errors = [];
      let data = {
        status: 'INCOMPLETE',
        query: b
      };

      if (req.file) {
        if (requester.isModerator && req.file.mimetype && req.file.mimetype.indexOf('image') >= 0) {
          req.callServiceProvider('updateProfileImage', {
            isModerator: requester.isModerator,
            uid: p.id,
            file: req.file
          });
        }
        else if (req.file.mimetype && req.file.mimetype.indexOf('image') >= 0) {
          req.callServiceProvider('updateProfileImage', {file: req.file});
        }
        else {
          errors.push({
            field: 'profile_image',
            errorMessage: 'Du kan kun uploade billeder her! Prøv med en anden fil!'
          });
        }
      }

      let libraryCheck = await checkUserLibraryInfo(req, b, p);
      errors = errors.concat(libraryCheck.errors);
      updatedProfileObject = Object.assign(updatedProfileObject, libraryCheck.updatedProfileObject);

      if (
        typeof b.displayname === 'string' &&
        b.displayname.length > 0
      ) {
        if (b.displayname !== p.displayName) {
          if (!(/([0-9]{6}-[0-9]{4}|[0-9]{10}|[0-9]{6} [0-9]{4})/.test(b.displayname)) && b.displayname.toLowerCase() !== p.username.toLowerCase()) {
            const displayNameExists = (await req.callServiceProvider('checkIfDisplayNameIsTaken', b.displayname))[0];

            if (displayNameExists.data && !displayNameExists.data.exists) {
              updatedProfileObject.displayName = b.displayname;
              updatedProfileObject.hasFilledInProfile = true;
            }
            else if (displayNameExists.data && displayNameExists.data.exists) {
              errors.push({
                field: 'displayname',
                errorMessage: 'Brugernavnet er desværre taget!'
              });
            }
            else {
              errors.push({
                field: 'displayname',
                errorMessage: 'Der er sket en fejl! Prøv igen senere!'
              });
            }
          }
          else {
            errors.push({
              field: 'displayname',
              errorMessage: 'Man må ikke benytte CPR-nummer, lånerkortnummer eller uni-login som brugernavn.'
            });
          }
        }
      }
      else {
        errors.push({
          field: 'displayname',
          errorMessage: 'Du skal have et brugernavn!'
        });
      }

      if (typeof b.description === 'string') {
        updatedProfileObject.description = b.description;
      }
      else {
        updatedProfileObject.description = '';
      }

      if (typeof b.email === 'string') {
        let emailValidity = (/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i) // eslint-disable-line
          .test(b.email);
        if (emailValidity) {
          updatedProfileObject.email = b.email;
        }
        else {
          errors.push({
            field: 'email',
            errorMessage: 'Du skal skrive en gyldig email addresse.'
          });
        }
      }
      else {
        updatedProfileObject.email = '';
      }

      if (typeof b.phone === 'string') {
        updatedProfileObject.phone = b.phone;
      }
      else {
        updatedProfileObject.phone = '';
      }

      if (typeof b.birthday === 'string' && b.birthday.length > 0) {
        updatedProfileObject.birthday = b.birthday;
      }
      else {
        updatedProfileObject.birthday = null;
      }

      if (typeof b.fullName === 'string') {
        updatedProfileObject.fullName = b.fullName;
      }
      else {
        updatedProfileObject.fullName = '';
      }

      if (errors.length > 0) {
        data.status = 'ERROR';
        data.errors = errors;
      }
      else if (JSON.stringify(updatedProfileObject) === '{}') {
        data.status = 'OK';
        data.redirect = '/profil/' + p.id;

        if (!req.xhr) {
          return res.redirect(data.redirect);
        }
      }
      else {
        if (requester.isModerator && req.params.id) {
          updatedProfileObject.isModerator = requester.isModerator;
          updatedProfileObject.uid = req.params.id;
        }

        const result = (await req.callServiceProvider('updateProfile', updatedProfileObject))[0];

        if (result.errors && result.errors.length > 0) {
          data.status = 'ERROR';
          data.errors = result.errors;
        }
        else if (result.status && result.data) {
          data.status = 'OK';
          data.redirect = '/profil/' + result.data.id;

          if (!req.xhr) {
            return res.redirect(data.redirect);
          }
        }
      }

      if (req.xhr) {
        res.setHeader('Content-Type', 'application/json');
        return res.send(JSON.stringify(data));
      }

      return res.render('page', {
        css: ['/css/profileedit.css'],
        js: ['/js/profileedit.js'],
        jsonData: [JSON.stringify(data)]
      });
    }
    catch (e) {
      return next(e);
    }
  });

ProfileRoutes.get(
  ['/:id', '/'],
  ensureAuthenticated, redirectBackToOrigin, ensureUserHasProfile, ensureUserHasValidLibrary,
  async function (req, res) {
    let profile;
    let profileId = req.params.id;
    const data = {
      feed: {},
      errors: [],
      reviews: [],
      campaigns: []
    };

    if (!profileId) {
      profile = JSON.parse(res.locals.profile);
      profileId = profile.profile.id;
    }

    try {
      data.userReviews = (await req.callServiceProvider('getOwnReview', {
        reviewownerid: profileId,
        offset: 0,
        order: 'created ASC'
      }))[0].data;
      data.feed = (await req.callServiceProvider('getUserFeed', {userId: profileId, offset: 0}))[0].body;
      data.campaigns = (await req.callServiceProvider('getAllCampaigns', {}))[0].body;
    }
    catch (e) { // eslint-disable-line no-catch-shadow
      data.errors = [e];
    }

    res.locals.title = data.feed && data.feed.profile && data.feed.profile.raw ? `${data.feed.profile.raw.displayName} - Biblo.dk` : 'Biblo.dk';

    res.render('page', {
      css: ['/css/profiledetail.css'],
      js: ['/js/profiledetail.js'],
      jsonData: [JSON.stringify(data)]
    });
  }
);


export default ProfileRoutes;
