/**
 * @file
 * Event for getting an authenticated token through smaug.
 */

const AuthenticateTransform = {

  event() {
    return 'authenticate';
  },

  requestTransform(event, {userId, libraryId, password}, connection) { // eslint-disable-line no-unused-vars
    const username = `${userId}@${libraryId}`;
    return this.callServiceClient('openplatform', 'authenticate', {username, password});
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    return {
      token: `Bearer ${response.access_token}`,
      expires: Date.now() + response.expires_in
    };
  }
};

export default AuthenticateTransform;
