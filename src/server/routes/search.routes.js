/**
 * @file
 * Configure main routes
 */
import express from 'express';

const SearchRoutes = express.Router();

SearchRoutes.get('/', async function (req, res, next) {

  try {
    // get search query from url
    const params = {
      q: (req.query.q) ? decodeURIComponent(req.query.q) : null,
      grupper: decodeURIComponent(req.query.grupper),
      forfatter: (req.query.forfatter) ? decodeURIComponent(req.query.forfatter) : null,
      materialer: (req.query.materialer) ? decodeURIComponent(req.query.materialer) : null,
      emneord: (req.query.emneord) ? decodeURIComponent(req.query.emneord) : null,
      limit: 5
    };

    let materialSearchResults = [];
    let groupSearchResults = [];
    groupSearchResults = await req.callServiceProvider('searchGroups', {
      q: (req.query.q) ? decodeURIComponent(req.query.q) : null,
      limit: 5
    }).catch(function (e) {
      next(e);
    });
    groupSearchResults = groupSearchResults[0];

    // if group filter is set and no material filter is set , then we do not expect material results (SD-589)
    if ((params.materialer !== null && params.materialer !== '')
      || params.grupper === false || params.grupper === 'false' || params.grupper === 'undefined') {
      materialSearchResults = await req.callServiceProvider('search', params).catch(function (e) {
        next(e);
      });
      materialSearchResults = materialSearchResults[0].data;
    }

    res.locals.title = `${params.q} - Søgning - Biblo.dk`;
    res.render('page', {
      css: ['/css/search.css'],
      js: ['/js/search.js'],
      jsonData: [JSON.stringify({
        materialSearchResults: materialSearchResults,
        groupSearchResults: groupSearchResults,
        query: params.q
      })]
    });
  }
  catch (e) {
    next(e);
  }
});

export default SearchRoutes;
