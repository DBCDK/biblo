/**
 * @file
 * Configure main routes
 */
import express from 'express';

const SearchRoutes = express.Router();

SearchRoutes.get('/', (req, res, next) => {

  // get search query from url
  const params = {
    q: (req.query.q) ? decodeURIComponent(req.query.q) : null,
    forfatter: (req.query.forfatter) ? decodeURIComponent(req.query.forfatter) : null,
    materialer: (req.query.materialer) ? decodeURIComponent(req.query.materialer) : null,
    emneord: (req.query.emneord) ? decodeURIComponent(req.query.emneord) : null
  };


  // call Open-Platform search endpoint
  req.callServiceProvider('search', params)
  .then((stuff) => {
    const materialSearchResults = stuff[0].data;
    res.render('page', {
      css: ['/css/search.css'],
      js: ['/js/search.js'],
      jsonData: [JSON.stringify({
        materialSearchResults: materialSearchResults,
        query: query
      })]
    });
  })
  .catch((e) => {
    next(e);
  });
});

export default SearchRoutes;

