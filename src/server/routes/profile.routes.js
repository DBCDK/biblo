'use strict';

/**
 * @file
 * Configure profile routes
 */

import config from '@dbcdk/biblo-config';
import express from 'express';
import multer from 'multer';
import http from 'http';

import {ensureAuthenticated, redirectBackToOrigin} from '../middlewares/auth.middleware';
import {ssrMiddleware} from '../middlewares/serviceprovider.middleware';
import {fullProfileOnSession} from '../middlewares/data.middleware';

let upload = multer({storage: multer.memoryStorage()});

const ProfileRoutes = express.Router();

ProfileRoutes.get('/rediger', ensureAuthenticated, ssrMiddleware, fullProfileOnSession, (req, res) => {
  let data = {
    profile: req.user.profile
  };

  res.render('page', {
    css: [],
    js: ['/js/profileedit.js'],
    jsonData: [JSON.stringify(data)]
  });
});

ProfileRoutes.post('/rediger', ensureAuthenticated, ssrMiddleware, fullProfileOnSession, upload.single('profile_image'), async function editProfilePost(req, res) {
  let data = {
    status: 'INCOMPLETE'
  };

  const b = req.body;
  let updatedProfileObject = {};
  let errors = [];

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
  else if (typeof b.libraryId === 'string' && b.libraryId.length > 0) {
    updatedProfileObject.favoriteLibrary = {
      libraryId: b.libraryId
    };
  }
  else {
    errors.push({
      field: 'libraryId',
      errorMessage: 'Du skal vælge et bibliotek!'
    });
  }

  if (typeof b.displayname === 'string' && b.displayname.length > 0) {
    const displayNameExists = (await req.callServiceProvider('checkProfileName', b.displayname))[0];

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
      errorMessage: 'Du skal have et brugernavn!'
    });
  }

  if (typeof b.description === 'string') {
    updatedProfileObject.description = b.description;
  }

  if (typeof b.email === 'string') {
    updatedProfileObject.email = b.email;
  }

  if (typeof b.phone === 'string') {
    updatedProfileObject.phone = b.phone;
  }

  if (errors.length > 0) {
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
    css: [],
    js: ['/js/profileedit.js'],
    jsonData: [JSON.stringify(data)]
  });
});

ProfileRoutes.get('/billede/:id', ssrMiddleware, (req, res) => {
  req.callServiceProvider('getProfileImage', req.params.id).then((imageObject) => {
    const imageUrl = config.biblo.getConfig().provider.services.community.endpoint + imageObject[0].body.url;

    res.setHeader('Content-Type', imageObject[0].body.type);
    http.get(imageUrl, function(result) {
      result.pipe(res);
    });
  }).catch((err) => {
    res.send(JSON.stringify({errors: [err]}));
  });
});

ProfileRoutes.get('/:id', ensureAuthenticated, redirectBackToOrigin, fullProfileOnSession, (req, res) => {
  let data = {};

  res.render('page', {
    css: [],
    js: ['/js/profiledetail.js'],
    jsonData: [JSON.stringify(data)]
  });
});

export default ProfileRoutes;
