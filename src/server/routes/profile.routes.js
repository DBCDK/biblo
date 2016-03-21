'use strict';

/**
 * @file
 * Configure profile routes
 */

import express from 'express';
import multer from 'multer';

import {ensureUserHasProfile, ensureAuthenticated, redirectBackToOrigin} from '../middlewares/auth.middleware';
import {fullProfileOnSession, ensureProfileImage} from '../middlewares/data.middleware';
import {profileEditForm} from '../forms/profile.form';

let upload = multer({storage: multer.memoryStorage()});

const ProfileRoutes = express.Router();

ProfileRoutes.get('/rediger', ensureAuthenticated, fullProfileOnSession, ensureProfileImage, (req, res) => {
  res.render('page', {
    css: ['/css/profileedit.css'],
    js: ['/js/profileedit.js']
  });
});

ProfileRoutes.post('/rediger', ensureAuthenticated, fullProfileOnSession, ensureProfileImage, upload.single('profile_image'), async function editProfilePost(req, res) {
  const p = req.session.passport.user.profile.profile;
  const b = req.body;
  let updatedProfileObject = {};
  let errors = [];
  let data = {
    status: 'INCOMPLETE',
    query: b
  };

  if (req.file) {
    if (req.file.mimetype && req.file.mimetype.indexOf('image') >= 0) {
      req.callServiceProvider('updateProfileImage', req.file);
    }
    else {
      errors.push({
        field: 'profile_image',
        errorMessage: 'Du kan kun uploade billeder her! Prøv med en anden fil!'
      });
    }
  }

  profileEditForm.handle(req, {
    other(form) {
      for (let key in form.fields) {
        if (form.fields.hasOwnProperty(key)) {
          if (form.fields[key].error) {
            errors.push({
              errorMessage: form.fields[key].error,
              field: key
            });
          }
        }
      }
    }
  });

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
    updatedProfileObject.email = b.email;
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

  if (JSON.stringify(updatedProfileObject) === '{}') {
    data.status = 'OK';
    data.redirect = '/profil/' + p.id;

    if (!req.xhr) {
      return res.redirect(data.redirect);
    }
  }
  else if (errors.length > 0) {
    data.status = 'ERROR';
    data.errors = errors;
  }
  else {
    const result = (await req.callServiceProvider('updateProfile', updatedProfileObject))[0];

    if (result.errors && result.errors.length > 1) {
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
});

ProfileRoutes.get(['/:id', '/'], ensureAuthenticated, redirectBackToOrigin, fullProfileOnSession, ensureUserHasProfile, ensureProfileImage, async function (req, res) {
  let profile,
    profileId = req.params.id,
    data = {
      feed: {},
      errors: []
    };

  if (!profileId) {
    profile = JSON.parse(res.locals.profile);
    profileId = profile.profile.id;
  }

  try {
    data.feed = (await req.callServiceProvider('getUserFeed', {userId: profileId, offset: 0}))[0].body;
  }
  catch (e) { // eslint-disable-line no-catch-shadow
    data.errors = [e];
  }

  res.render('page', {
    css: ['/css/profiledetail.css'],
    js: ['/js/profiledetail.js'],
    jsonData: [JSON.stringify(data)]
  });
});


export default ProfileRoutes;
