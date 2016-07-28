/**
 * @file
 * Configure campaign routes
 */

import express from 'express';
import request from 'request';
import path from 'path';
import {pick, find, filter} from 'lodash';
import PDFDocument from 'pdfkit';
import twemoji from 'twemoji';
import Logger from 'dbc-node-logger';

import {
  ensureUserHasProfile,
  ensureAuthenticated,
  redirectBackToOrigin,
  ensureUserHasValidLibrary
} from '../middlewares/auth.middleware';

const logger = new Logger();

function pad(n, width, z) {
  z = z || '0';
  n += '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const CampaignRoutes = express.Router();

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

/**
 * Returns a promise with the requested image in a buffer
 * @param url of the image resource
 */
function fetchImageBuffer(url) { // eslint-disable-line no-unused-vars
  return new Promise((resolve, reject) => {
    request.defaults({encoding: null})(url, function(err, response, buffer) {
      if (err) {
        reject(new Error('could not fetch image'));
      }
      else {
        resolve(buffer);
      }
    });
  });
}

/**
 * Generates a PDF læsebevies and displays it to the user in the browser
 * ¨
 * @param {object} frontpageData
 * @param {array} reviewsWithWorkData
 *
 * @return {Promise}
 */
function createPDFDocument(frontpageData, reviewsWithWorkData) {

  // Allocate PDF
  let doc = new PDFDocument({
    bufferPages: true,
    info: {Title: frontpageData.displayName + '\'s Læsebevis for ' + frontpageData.campaignName}
  });

  // replace any emojis with whitespace in displayName
  if (twemoji.test(frontpageData.displayName)) {
    logger.notice('While generating a læsebevis one or more emojis was found in a users diplayName', {frontpageData: frontpageData});
    frontpageData.displayName = twemoji.replace(frontpageData.displayName, '');
  }

  // top decor
  doc.image(frontpageData.bortImage, 0, 0, {width: 650});

  // big campaign logo
  doc.image(frontpageData.campaignLogo, 200, 20, {width: 200});

  doc.fontSize(50).moveDown().moveDown().text('LÆSEBEVIS', {align: 'center'});
  doc.fontSize(15).moveDown().text('Biblo erklærer hermed at', {align: 'center'});

  doc.fontSize(30).moveDown().text(frontpageData.displayName, {align: 'center'});
  doc.moveTo(200, 340).lineTo(420, 340).dash(1, {space: 2}).stroke();

  doc.fontSize(15).moveDown().moveDown().text('har læst og anmeldt ' + frontpageData.campaignReviewCount + ' bøger til ' + frontpageData.campaignName, {align: 'center'});

  // insert "godkendt af biblo" sticker
  doc.image(frontpageData.bibloAbidesImage, 490, 440, {width: 100});

  // horizontal ruler
  doc.moveTo(10, 500).lineTo(600, 500).dash(1, {space: 2}).stroke();

  const fontSize = 10;
  // left-side form fields
  doc.fontSize(fontSize).text('Navn', 65, 550);
  doc.moveTo(100, 550 + fontSize).lineTo(270, 550 + fontSize).dash(1, {space: 2}).stroke();
  doc.fontSize(fontSize).text(frontpageData.fullName, 100 + 3, 550);

  doc.fontSize(fontSize).text('Mail', 65, 575);
  doc.moveTo(100, 575 + fontSize).lineTo(270, 575 + fontSize).dash(1, {space: 2}).stroke();
  doc.fontSize(fontSize).text(frontpageData.email, 100 + 3, 575);

  doc.fontSize(fontSize).text('Tlf.', 65, 600);
  doc.moveTo(100, 600 + fontSize).lineTo(270, 600 + fontSize).dash(1, {space: 2}).stroke();
  doc.fontSize(fontSize).text(frontpageData.phone, 100 + 3, 600);

  doc.fontSize(fontSize).text('By', 65, 625);
  doc.moveTo(100, 625 + fontSize).lineTo(270, 625 + fontSize).dash(1, {space: 2}).stroke();

  // right-side form fields
  doc.fontSize(fontSize).text('Alder', 305, 550);
  doc.moveTo(350, 550 + fontSize).lineTo(350 + 170, 550 + fontSize).dash(1, {space: 2}).stroke();
  doc.fontSize(fontSize).text(frontpageData.age, 350 + 3, 550);

  doc.fontSize(fontSize).text('Skole', 305, 575);
  doc.moveTo(350, 575 + fontSize).lineTo(350 + 170, 575 + fontSize).dash(1, {space: 2}).stroke();

  doc.fontSize(fontSize).text('Klasse', 305, 600);
  doc.moveTo(350, 600 + fontSize).lineTo(350 + 170, 600 + fontSize).dash(1, {space: 2}).stroke();

  doc.fontSize(fontSize).text('Bibliotek', 305, 625);
  doc.moveTo(350, 625 + fontSize).lineTo(350 + 170, 625 + fontSize).dash(1, {space: 2}).stroke();
  doc.fontSize(fontSize).text(frontpageData.branchShortName, 350 + 3, 625);

  // bottom decor
  doc.image(frontpageData.bortImage, 0, 700, {width: 650});

  // footer Biblo sticker
  doc.image(frontpageData.bibloPortraitImage, 305, 725, {width: 30});

  // force new page
  doc.addPage();
  for (let i in reviewsWithWorkData) {
    // jump to next page if too close bottom of page
    if (doc.y > 600) {
      doc.addPage();
    }

    // write review
    const review = reviewsWithWorkData[i];

    // replace any emojis with whitespace
    if (twemoji.test(review.content)) {
      logger.notice('While generating a læsebevis one or more emojis was found in a review', {review: review});
      review.content = twemoji.replace(review.content, '');
    }

    doc.moveDown(2);
    doc.fontSize(12);
    doc.lineGap(6);
    doc.image(frontpageData.campaignLogoSmall, 500, doc.y, {width: 30});
    doc.text(review.dcTitle);
    doc.text((typeof review.creator === 'undefined') ? '' : review.creator);
    const date = new Date(Date.parse(review.created));
    doc.text(pad(date.getDay(), 2) + '-' + pad(date.getMonth(), 2) + '-' + date.getFullYear().toString()).moveDown();
    doc.text(review.content.replace(/(\r\n|\n|\r)/gm, '\n'));
    doc.moveDown().moveDown();
    doc.moveTo(0, doc.y).lineTo(700, doc.y).dash(1, {space: 2}).stroke();
  }

  // write page header/footer for pages 2 to n
  const pageRange = doc.bufferedPageRange();
  for (let i = 1; i < pageRange.count; i++) {
    doc.switchToPage(i);
    // page header
    doc.text('Anmeldelser af ' + frontpageData.displayName + ' fra ' + frontpageData.branchShortName, 5, 5);
    // page footer
    doc.image(frontpageData.bibloBerzerkImage, 500, 750, {width: 100});
  }

  doc.flushPages();
  return new Promise((resolve) => resolve(doc));
}

// /laesebevis endpoint
CampaignRoutes.get(
  '/laesebevis/:id',
  ensureAuthenticated, redirectBackToOrigin, ensureUserHasProfile, ensureUserHasValidLibrary,
  async function(req, res, next) {

    const profile = req.session.passport.user.profile.profile;
    const profileId = profile.id;
    const campaignId = Number(req.params.id);

    try {
      const ownReviews = (await req.callServiceProvider('getOwnReview', {
        reviewownerid: profileId,
        offset: 0,
        order: 'created ASC'
      }))[0].data;

      const library = (await req.callServiceProvider('getLibraryDetails', {agencyId: profile.favoriteLibrary.libraryId}))[0].pickupAgency;

      const ownReviewsInCampaign = filter(ownReviews, (review) => {
        return (typeof review.campaign !== 'undefined' && review.campaign.id === campaignId);
      });

      const workPids = ownReviewsInCampaign.map((review) => review.pid);

      // we need to fetch works in bathces of 20 ( enforced by openplatform API )
      let reviewedWorks = [];
      if (workPids.length > 0) {
        const batchCount = Math.ceil(workPids.length / 20);
        for (let i = 0; i < batchCount; i++) {
          const workBatch = (await req.callServiceProvider('work', {
            pids: workPids.slice(i * 20, (i + 1) * 20),
            fields: ['pid', 'dcTitle', 'dcTitleFull', 'creator']
          }))[0].data;
          reviewedWorks = reviewedWorks.concat(workBatch);
        }
      }

      const campaigns = (await req.callServiceProvider('getCampaigns', {}))[0].body;

      // get the campaign that matches campaignId
      const campaign = find(campaigns, (c) => {
        return c.id === campaignId;
      });

      let pid2work = {};
      for (const i in reviewedWorks) { // eslint-disable-line guard-for-in
        pid2work[reviewedWorks[i].pid] = reviewedWorks[i];
      }

      const reviewsWithWorkData = ownReviewsInCampaign.map((review) => {
        return Object.assign(pick(review, 'content', 'rating', 'created', 'id', 'reviewownerid'), pid2work[review.pid], {campaignLogo: campaign.logos.small});
      });

      const age = (profile.birthday === null) ? '' : computeAge(new Date(Date.parse(profile.birthday)));
      const frontpageData = {
        campaignName: campaign.campaignName,
        campaignLogo: path.resolve(__dirname + '/../../../static/' + campaign.logos.medium),
        campaignLogoSmall: path.resolve(__dirname + '/../../../static/' + campaign.logos.small),
        bibloBerzerkImage: path.resolve(__dirname + '/../../../static/images/biblo_logo_læs-løspå-biblo.png'),
        bibloPortraitImage: path.resolve(__dirname + '/../../../static/images/biblo_logo_portrait.png'),
        bibloAbidesImage: path.resolve(__dirname + '/../../../static/images/biblo_logo_godkendt-af.png'),
        bortImage: path.resolve(__dirname + '/../../../static/bort.png'),
        displayName: profile.displayName,
        fullName: profile.fullName,
        email: profile.email,
        userId: profile.id,
        age: age,
        phone: profile.phone,
        branchShortName: (Array.isArray(library.branchShortName) ? library.branchShortName[0] : library.branchShortName).$value,
        campaignReviewCount: ownReviewsInCampaign.length
      };

      const pdfDoc = (await createPDFDocument(frontpageData, reviewsWithWorkData));

      res.locals.title = 'Læsebevis - Biblo.dk';

      // pipe result as pdf
      res.setHeader('Content-Type', 'application/pdf');
      pdfDoc.pipe(res);
      pdfDoc.end();

    }
    catch (e) {
      logger.error('An error occured while generating or delivering a læsebevis', {
        error: e,
        profile: profile
      });
      next(e);
    }
  }
);

export default CampaignRoutes;
