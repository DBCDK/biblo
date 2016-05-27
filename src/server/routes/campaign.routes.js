/**
 * @file
 * Configure campaign routes
 */

import express from 'express';
import request from 'request';
import {pick, find, filter} from 'lodash';
import PDFDocument from 'pdfkit';


import {
  ensureUserHasProfile,
  ensureAuthenticated,
  redirectBackToOrigin,
  ensureUserHasValidLibrary
} from '../middlewares/auth.middleware';
import {fullProfileOnSession, ensureProfileImage} from '../middlewares/data.middleware';

function pad(n, width, z) {
  z = z || '0';
  n += '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const CampaignRoutes = express.Router();


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
function fetchImageBuffer(url) {
  return new Promise((resolve, reject) => {
    request.defaults({encoding: null})(url, function(err, response, buffer) {
      if (err) {
        reject(new Error('could not fetch image'));
      }
      else {
        resolve(new Buffer(buffer));
      }
    });
  });
}


async function createPDFDocument(frontpageData, reviewsWithWorkData) {

  console.log(frontpageData); // eslint-disable-line no-console
  console.log(reviewsWithWorkData); // eslint-disable-line no-console

  // load all image resources
  let imgBort = (await fetchImageBuffer(frontpageData.bortImage));
  let imgBibloAbides = (await fetchImageBuffer(frontpageData.bibloAbidesImage));
  let imgBibloPortrait = (await fetchImageBuffer(frontpageData.bibloPortraitImage));
  let imgBibloBerzerk = (await fetchImageBuffer(frontpageData.bibloBerzerkImage));
  let imgCampaignLogo = (await fetchImageBuffer(frontpageData.campaignLogo));
  let imgCampaignLogoSmall = (await fetchImageBuffer(frontpageData.campaignLogoSmall));

  // write pdf
  let doc = new PDFDocument({bufferPages: true, info: {Title: frontpageData.username + '\'s Læsebevis for ' + frontpageData.campaignName}});

  // top decor
  doc.image(imgBort, 0, 0, {width: 650});

  // big campaign logo
  doc.image(imgCampaignLogo, 200, 20, {width: 200});


  doc.fontSize(50).moveDown().moveDown().text('LÆSEBEVIS', {align: 'center'});
  doc.fontSize(15).moveDown().text('Biblo erklærer hermed at', {align: 'center'});

  doc.fontSize(30).moveDown().text(frontpageData.username, {align: 'center'});
  doc.moveTo(200, 340).lineTo(420, 340).dash(1, {space: 2}).stroke();

  doc.fontSize(15).moveDown().moveDown().text('har læst og anmeldt ' + frontpageData.campaignReviewCount + ' bøger til ' + frontpageData.campaignName, {align: 'center'});

  // insert "godkendt af biblo" sticker
  doc.image(imgBibloAbides, 490, 440, {width: 100});


  // horizontal ruler
  doc.moveTo(10, 500).lineTo(600, 500).dash(1, {space: 2}).stroke();


  const fontSize = 10;
  // left-side form fields
  doc.fontSize(fontSize).text('Navn', 65, 550);
  doc.moveTo(100, 550+fontSize).lineTo(270, 550+fontSize).dash(1, {space: 2}).stroke();
  doc.fontSize(fontSize).text(frontpageData.fullName, 100+3, 550);

  doc.fontSize(fontSize).text('Mail', 65, 575);
  doc.moveTo(100, 575+fontSize).lineTo(270, 575+fontSize).dash(1, {space: 2}).stroke();
  doc.fontSize(fontSize).text(frontpageData.email, 100+3, 575);

  doc.fontSize(fontSize).text('Tlf.', 65, 600);
  doc.moveTo(100, 600+fontSize).lineTo(270, 600+fontSize).dash(1, {space: 2}).stroke();
  doc.fontSize(fontSize).text(frontpageData.phone, 100+3, 600);

  doc.fontSize(fontSize).text('By', 65, 625);
  doc.moveTo(100, 625+fontSize).lineTo(270, 625+fontSize).dash(1, {space: 2}).stroke();


  // right-side form fields
  doc.fontSize(fontSize).text('Alder', 305, 550);
  doc.moveTo(350, 550+fontSize).lineTo(350 + 170, 550+fontSize).dash(1, {space: 2}).stroke();
  doc.fontSize(fontSize).text(frontpageData.age, 350+3, 550);

  doc.fontSize(fontSize).text('Skole', 305, 575);
  doc.moveTo(350, 575+fontSize).lineTo(350 + 170, 575+fontSize).dash(1, {space: 2}).stroke();

  doc.fontSize(fontSize).text('Klasse', 305, 600);
  doc.moveTo(350, 600+fontSize).lineTo(350 + 170, 600+fontSize).dash(1, {space: 2}).stroke();

  doc.fontSize(fontSize).text('Bibliotek', 305, 625);
  doc.moveTo(350, 625+fontSize).lineTo(350 + 170, 625+fontSize).dash(1, {space: 2}).stroke();
  doc.fontSize(fontSize).text(frontpageData.branchShortName, 350+3, 625);

  // bottom decor
  doc.image(imgBort, 0, 700, {width: 650});

  // footer Biblo sticker
  doc.image(imgBibloPortrait, 305, 725, {width: 30});

  // force new page
  doc.addPage();
  for (let i in reviewsWithWorkData) {
    // jump to next page if too close bottom of page
    if (doc.y > 600) {
      doc.addPage();
    }

    // write review
    const review = reviewsWithWorkData[i];

    doc.moveDown(2);
    doc.fontSize(12);
    doc.lineGap(6);
    doc.image(imgCampaignLogoSmall, 500, doc.y, {width: 30});
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
    doc.text('Anmeldelser af '+ frontpageData.username +' fra ' + frontpageData.branchShortName, 5, 5);
    // page footer
    doc.image(imgBibloBerzerk, 500, 750, {width: 100});
  }

  doc.flushPages();
  return new Promise((resolve) => resolve(doc));
}


CampaignRoutes.get(
  '/laesebevis/:id',
  ensureAuthenticated, redirectBackToOrigin, fullProfileOnSession, ensureUserHasProfile, ensureUserHasValidLibrary, ensureProfileImage,
  async function(req, res, next) {

    const profile = req.session.passport.user.profile.profile;

    const profileId = profile.id;

    const campaignId = Number(req.params.id);

    try {

      const ownReviews = (await req.callServiceProvider('getOwnReview', {reviewownerid: profileId, offset: 0, order: 'created ASC'}))[0].data;
      const library = (await req.callServiceProvider('getLibraryDetails', {agencyId: profile.favoriteLibrary.libraryId}))[0].pickupAgency;

      const ownReviewsInCampaign = filter(ownReviews, (review) => {
        return review.campaign.id === campaignId;
      });

      const workPids = ownReviewsInCampaign.map((review) => review.pid);


      // we need to fetch works in bathces of 20 ( enforced by openplatform API )
      let reviewedWorks = [];
      if (workPids.length > 0) {
        const batchCount = Math.ceil(workPids.length / 20);
        for (let i=0; i < batchCount; i++) {
          const workBatch = (await req.callServiceProvider('work', {pids: workPids.slice(i*20, (i+1)*20), fields: ['pid', 'dcTitle', 'dcTitleFull', 'creator']}))[0].data;
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

      const reviewsWithWorkData = ownReviews.map((review) => {
        return Object.assign(pick(review, 'content', 'rating', 'created'), pid2work[review.pid], {campaignLogo: campaign.logos.small});
      });

      const frontpageData = {
        campaignName: campaign.campaignName,
        campaignLogo: 'http://' + req.headers.host + '/' + campaign.logos.medium,
        campaignLogoSmall: 'http://' + req.headers.host + '/' + campaign.logos.small,
        bibloBerzerkImage: 'http://' + req.headers.host + '/images/biblo_logo_læs-løspå-biblo.png',
        bibloPortraitImage: 'http://' + req.headers.host + '/images/biblo_logo_portrait.png',
        bibloAbidesImage: 'http://' + req.headers.host + '/images/biblo_logo_godkendt-af.png',
        bortImage: 'http://' + req.headers.host + '/bort.png',
        username: profile.displayName,
        fullName: profile.fullName,
        email: profile.email,
        age: computeAge(new Date(Date.parse(profile.birthday))),
        phone: profile.phone,
        branchShortName: library.branchShortName[0].$value,
        campaignReviewCount: ownReviewsInCampaign.length
      };

      const pdfDoc = (await createPDFDocument(frontpageData, reviewsWithWorkData));

      // pipe result as pdf
      res.setHeader('Content-Type', 'application/pdf');
      pdfDoc.pipe(res);
      pdfDoc.end();

    }
    catch (e) {
      next(e);
    }
  }
);


export default CampaignRoutes;
