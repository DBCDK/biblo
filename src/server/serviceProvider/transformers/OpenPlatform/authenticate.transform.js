/**
 * @file
 * Event for getting an authenticated token through smaug.
 */

const AuthenticateTransform = {
  event() {
    return 'authenticate';
  },

  // eslint-disable-next-line no-unused-vars
  requestTransform(event, {userId, libraryId, password}, connection) {
    const username = `${userId}@${libraryId}`;
    return this.callServiceClient('cached/standard/openplatform', 'authenticate', {username, password});
  },

  // eslint-disable-next-line no-unused-vars
  responseTransform(response, query, connection) {
    return {
      token: `Bearer ${response.access_token}`,
      expires: Date.now() + response.expires_in * 1000,
      raw: response.access_token
    };
  }
};

export default AuthenticateTransform;
