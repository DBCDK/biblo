/**
 * @file
 * Configure main routes
 */
import express from 'express';

const SearchRoutes = express.Router();

SearchRoutes.get('/', (req, res) => {

  // get search query from url
  const query = req.query.q;

  // call Open-Platform search endpoint
  req.callServiceProvider('search', {
    q: query
  }).then((stuff) => {
    const materialSearchResults = stuff[0].data;
    res.render('page', {
      css: ['/css/search.css'],
      js: ['/js/search.js'],
      jsonData: [JSON.stringify({
        materialSearchResults: materialSearchResults,
        query: query
      })]
    });
  });

});

export default SearchRoutes;

