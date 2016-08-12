/**
 * @file
 * Event for placing an order through openPlatform.
 */

const PlaceOrderTransform = {

  event() {
    return 'order';
  },

  getNeedBeforeDate(days = 90) {
    return (new Date(Date.now() + days * 86400000)).toISOString().substring(0, 10);
  },

  requestTransform(event, {pids, libraryId, name, phone, email, token}) {
    return this.callServiceClient('openplatform', 'order', {
      request: {
        library: libraryId,
        pids: pids,
        expires: this.getNeedBeforeDate(90),
        name: name,
        phone: phone,
        email: email
      },
      token: token
    });
  },

  responseTransform(response) {
    const body = JSON.parse(response.body);
    if (body.statusCode !== 200) {
      throw new Error(body.error);
    }
    return body;
  }
};

export default PlaceOrderTransform;
