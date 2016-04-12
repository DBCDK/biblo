const getLibraryDetails = {

  event() {
    return 'getLibraryDetails';
  },

  requestTransform(event, query) { // eslint-disable-line no-unused-vars
    return this.callServiceClient('openagency', 'getOpenAgency', {
      id: [query.agencyId]
    });
  },

  responseTransform(response, query) { // eslint-disable-line no-unused-vars
    // TODO: error handling and response formatting
    return response;
  }
};

export default getLibraryDetails;
