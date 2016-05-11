const pickupAgencyList = {

  event() {
    return 'pickupAgencyList';
  },

  requestTransform(event, query) { // eslint-disable-line no-unused-vars
    return this.callServiceClient('openagency', 'getAgencyBranches', {
      id: [query.agencyId]
    });
  },

  responseTransform(response, query) { // eslint-disable-line no-unused-vars
    return response;
  }
};

export default pickupAgencyList;
