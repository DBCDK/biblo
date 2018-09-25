const getLibraryDetails = {
  event() {
    return 'getLibraryDetails';
  },

  requestTransform(event, query) {
    // eslint-disable-line no-unused-vars
    return this.callServiceClient('cached/standard/openagency', 'getOpenAgency', {
      id: [query.agencyId]
    });
  },

  // eslint-disable-next-line no-unused-vars
  responseTransform(response, query) {
    // TODO: error handling and response formatting
    return response;
  }
};

export default getLibraryDetails;
