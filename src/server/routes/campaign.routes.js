/**
 * @file
 * Configure campaign routes
 */

import express from 'express';

import {pick, find, filter} from 'lodash';

import {config} from '@dbcdk/biblo-config';
import twemoji from 'twemoji';
import Logger from 'dbc-node-logger';
import pdf from 'html-pdf';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {CampaignCertificate} from '../../client/components/CampaignCertificate/CampaignCertificate.component';


import {getContributions} from '../utils/campaign.util.js';

import {
  ensureUserHasProfile,
  ensureAuthenticated,
  ensureUserHasValidLibrary
} from '../middlewares/auth.middleware';

const CampaignRoutes = express.Router();
const logger = new Logger();
const proxy = config.get('Proxy.http_proxy');

/**
 * Computes age
 *
 * @param {Date} birthday
 * @return {number}
 */
function computeAge(birthday) {
  const now = new Date(Date.now());
  const isPastBirthday = birthday.getMonth() + '' + birthday.getDay() < now.getMonth() + '' + now.getDay();
  let age = now.getFullYear() - birthday.getFullYear();
  if (!isPastBirthday) {
    age -= 1;
  }
  return age;
}

function generatePDFFromHTML(html, baseUrl) {
  const phantomArgs = [];

  if (proxy) {
    phantomArgs.push(`--proxy=${proxy}`);
  }

  const renderingOptions = {
    format: 'A4',
    base: baseUrl,
    header: {
      height: '10mm'
    },
    footer: {
      height: '20mm',
    },
    margin: '1cm',
    phantomArgs
  };

  return new Promise((resolve, reject) => {
    pdf.create(html, renderingOptions).toStream((err, stream) => {
      if (err) {
        // Reject leads to next handler which logs the bug and gives the user a nice error page.
        reject(err);
      }

      resolve(stream);
    });
  });
}

/**
 * This method generates a PDF from a request.
 * @param {Object}req
 * @param {Object}res
 * @param {Function}next
 */
async function getCampaignHTML(req) {
  const baseurl = `http://localhost:${req.app.get('port')}`;
  const basepath = `file://${req.app.get('statics')}`;
  const campaignId = req.params[0];
  const campaign = (await req.callServiceProvider('getCampaign', {id: campaignId}))[0].body;
  const profile = req.session.passport.user.profile.profile;
  profile.displayName = twemoji.parse(profile.displayName);
  if (profile.birthday) {
    profile.age = computeAge(new Date(profile.birthday));
  }

  const contributions = await getContributions(req, campaign, profile.id);
  const library = (await req.callServiceProvider('getLibraryDetails', {agencyId: profile.favoriteLibrary.libraryId}))[0].pickupAgency;
  const works = {};
  await Promise.all(contributions.review.data.map(review => {
    return req.callServiceProvider('work', {pids: [review.pid]}).then(work => {
      work = work[0].data[0];

      if (!work.coverUrl) {
        work.coverUrl = `/images/cover/${work.workType}.png`;
      }

      (work.collection || []).forEach(pid => {
        works[pid] = work;
      });
    });
  }));

  const reactMarkup = renderToStaticMarkup(
    <CampaignCertificate
      baseurl={baseurl}
      basepath={basepath}
      campaign={campaign}
      profile={profile}
      library={library}
      contributions={contributions}
      works={works}
    />
  );
  return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Kampagne bevis</title>
          <link rel="stylesheet" type="text/css" href="${baseurl}/css/campaigncertificate.css">
          <link rel="stylesheet" type="text/css" href="${basepath}/public/css/campaigncertificate.css">
        </head>
        <body>
          <div class="content">
            ${reactMarkup}
          </div>
        </body>
      </html>`;
}


CampaignRoutes.get(/^\/bevis\/([0-9]+).html/, ensureAuthenticated, ensureUserHasProfile, ensureUserHasValidLibrary, async (req, res, next) => {
  try {
  const html = await getCampaignHTML(req);
  res.send(html);
  } catch (e) {
    console.log(e);
  }

});

CampaignRoutes.get(/^\/bevis\/([0-9]+).pdf$/, ensureAuthenticated, ensureUserHasProfile, ensureUserHasValidLibrary, async (req, res, next) => {
  const baseurl = `http://localhost:${req.app.get('port')}`;
  try {
    const html = await getCampaignHTML(req, res);
    const pdfStream = (await generatePDFFromHTML(html, baseurl));
    res.set('Content-Type', 'application/pdf');
    pdfStream.pipe(res);
  }
  catch (err) {
    next(err);
  }
});

export default CampaignRoutes;
