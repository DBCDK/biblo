/**
 * @file
 * Configure main routes
 */
import express from 'express';

const SearchRoutes = express.Router();

SearchRoutes.get('/', async function (req, res, next) {

  // get search query from url
  const params = {
    q: (req.query.q) ? decodeURIComponent(req.query.q) : null,
    forfatter: (req.query.forfatter) ? decodeURIComponent(req.query.forfatter) : null,
    materialer: (req.query.materialer) ? decodeURIComponent(req.query.materialer) : null,
    emneord: (req.query.emneord) ? decodeURIComponent(req.query.emneord) : null
  };

  // call Community service search (we expect this to be fast so we wait for the result here)
  let groupSearchResults = await req.callServiceProvider('searchGroups', {
    q: req.query.q, limit: 5 // 5 is the initial
  });

  groupSearchResults = groupSearchResults[0];

  // call Open-Platform search endpoint
  req.callServiceProvider('search', params)
    .then((stuff) => {
      const materialSearchResults = stuff[0].data;
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
    })
    .catch((e) => {
      next(e);
    });
});

export default SearchRoutes;
