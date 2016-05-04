const PlaceOrderTransform = {

  event() {
    return 'placeOrder';
  },

  getNeedBeforeDate(days) {
    return (new Date(Date.now() + days * 86400000)).toISOString();
  },

  requestTransform(event, request) {
    return this.callServiceClient('openorder', 'placeOrder', {
      agencyId: request.agencyId,
      pids: request.pids.split(','),
      userId: request.loanerId,
      needBeforeDate: this.getNeedBeforeDate(90)
    });
  },

  responseTransform(response) {
    let data = {};
    data.orderPlaced = false;
    data.pids = response.pids;
    data.errors = [];

    if (!response.placeOrderResponse) {
      data.errors.push('Fejl ved bestilling');
      data.response = response;
    }
    else if (response.placeOrderResponse.hasOwnProperty('orderPlaced')) {
      data.orderPlaced = true;
    }

    return data;
  }
};

export default PlaceOrderTransform;
