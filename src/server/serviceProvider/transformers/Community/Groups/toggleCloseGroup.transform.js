import moment from 'moment';


const ToggleCloseGroupTransform = {

  event() {
    return 'toggleCloseGroup';
  },

  requestTransform(event, query, connection) { // eslint-disable-line no-unused-vars

    if (connection.request.session.passport) {
      const passport = connection.request.session.passport;

      if (!passport.user.profile.profile.isModerator) {
        return Promise.reject(new Error('user does not have access'));
      }

      const params = {
        id: query.id,
        accessToken: passport.user.id,
        timeClosed: query.close && moment().format('YYYY-MM-DD') || null
      };

      return this.callServiceClient('community', 'closeGroup', params);
    }

    return Promise.reject(new Error('user not logged in'));
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    if (response.statusCode !== 200) {
      throw new Error('Call to community service, with method closeGroup failed');
    }

    return response.body;
  }
};

export default ToggleCloseGroupTransform;
