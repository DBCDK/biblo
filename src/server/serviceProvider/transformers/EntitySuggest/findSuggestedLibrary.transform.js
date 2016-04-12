const findSuggestedLibrary = {

  event() {
    return 'findSuggestedLibrary';
  },

  requestTransform(event, query) {
    return this.callServiceClient('entitysuggest', 'getLibrarySuggestions', {
      query: query
    });
  },

  responseTransform(response, query) {
    return {
      body: {
        suggestions: response.response.suggestions.map(
          (suggest) => {
            return suggest.suggestion;
          }
        ),
        numFound: response.response.numFound,
        query
      },
      statusCode: 200,
      statusMessage: 'OK'
    };
  }
};

export default findSuggestedLibrary;
