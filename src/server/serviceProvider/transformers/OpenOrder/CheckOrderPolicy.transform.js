const CheckOrderPolicyTransform = {

  event() {
    return 'checkOrderPolicy';
  },

  checkOrderPolicy(request) {
    return this.callServiceClient('openorder', 'checkOrderPolicy', request);
  },

  requestTransform(event, request, connection) {
    if (!request.agencyId) {
      try {
        const profile = connection.request.session.passport.user.profile.profile;
        request.agencyId = profile.favoriteLibrary.libraryId;
      }
      catch (err) {
        return Promise.resolve({error: 'Could not find library id in session or request or user is not logged in'});
      }
    }

    return this.checkOrderPolicy({
      agencyId: request.agencyId,
      pids: request.pids,
      loggedIn: true
    });
  },

  responseTransform(response, {pids}) {
    let data = {};
    data.orderPossible = false;
    data.pids = pids;
    data.errors = [];

    if (response.error) {
      data.errors.push(response.error);
      return data;
    }

    if (!(response.hasOwnProperty('checkOrderPolicyResponse') && response.checkOrderPolicyResponse.hasOwnProperty('orderPossible'))) {
      data.errors.push('could not determine order policy');
    }
    else if (response.checkOrderPolicyResponse.orderPossible.$ === 'true') {
      data.orderPossible = true;
    }
    else {
      data.errors.push('order not possible');
    }

    return data;
  }

};

export default CheckOrderPolicyTransform;
