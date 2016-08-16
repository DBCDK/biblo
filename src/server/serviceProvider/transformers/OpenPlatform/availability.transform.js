const AvailabilityTransform = {

  event() {
    return 'availability';
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

    return this.callServiceClient('openplatform', 'availability', {
      libraryId: request.agencyId,
      userId: request.agencyId,
      pids: request.pids,
      loggedIn: true
    });
  },

  responseTransform(response, {pids}) {
    const body = JSON.parse(response.body);
    if (body.statusCode !== 200) {
      return {
        errors: ['could not determine order policy']
      };
    }
    return {
      data: body.data,
      pids: pids
    };
  }

};

export default AvailabilityTransform;
