'use strict';

const getLibraryDetails = {

  event() {
    return 'getLibraryDetails';
  },

  requestTransform(event, query) {
    return this.callServiceClient('openagency', 'getOpenAgency', {
        id: [query.agencyId]
    });
  },

  responseTransform(response, query) {
    // TODO: error handling and response formatting
    return response;
  }
};

export default getLibraryDetails;
