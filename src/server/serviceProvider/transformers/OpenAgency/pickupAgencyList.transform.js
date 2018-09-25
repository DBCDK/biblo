const pickupAgencyList = {
  event() {
    return 'pickupAgencyList';
  },

  requestTransform(event, query) {
    // eslint-disable-line no-unused-vars
    return this.callServiceClient('cached/standard/openagency', 'getAgencyBranches', {
      id: [query.agencyId]
    });
  },

  // eslint-disable-next-line no-unused-vars
  responseTransform(response, query) {
    return response;
  }
};

export default pickupAgencyList;
