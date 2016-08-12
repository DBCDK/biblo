/**
 * @file
 * Event for getting an authenticated token through smaug.
 */

const AuthenticateTransform = {

  event() {
    return 'authenticate';
  },

  requestTransform(event, params, connection) { // eslint-disable-line no-unused-vars
    return this.callServiceClient('openplatform', 'authenticate', params);
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    return {
      token: `Bearer ${response.access_token}`,
      expires: Date.now() + response.expires_in
    };
  }
};

export default AuthenticateTransform;
