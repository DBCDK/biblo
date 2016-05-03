'use strict';

const CheckOrderPolicyTransform = {

  event() {
    return 'checkOrderPolicy';
  },

  checkOrderPolicy(request) {
    return this.callServiceClient('openorder', 'checkOrderPolicy', request);
  },

  requestTransform(event, request, connection) {
    return this.checkOrderPolicy({
      agencyId: request.agencyId,
      pids: request.pids,
      loggedIn: true
    });
  },

  responseTransform(response) {
    let data = {};
    data.orderPossible = false;
    data.pids = response.pids;
    data.errors = [];

    if (!response.hasOwnProperty('checkOrderPolicyResponse') || !response.checkOrderPolicyResponse.hasOwnProperty('orderPossible')) {
      data.errors.push('could not determine order policy');
    }
    else if (response.checkOrderPolicyResponse.orderPossible[0] === 'true') {
      data.orderPossible = true;
    }
    else {
      data.errors.push('order not possible');
    }

    return data;
  }

};

export default CheckOrderPolicyTransform;
