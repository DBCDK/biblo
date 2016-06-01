const GetUserStatusTransform = {
  event() {
    return 'getUserStatus';
  },

  requestTransform(event, {agencyId, userId, pinCode}) {
    const params = {
      agencyId,
      userId,
      pinCode
    };

    return this.callServiceClient('openuserstatus', 'getUserStatus', params);
  },

  responseTransform(response) {
    let data = {
      result: {
        orders: []
      },
      errors: []
    };

    try {
      if (!response.hasOwnProperty('ous:getUserStatusResponse')) {
        throw new Error('Error in response from user status!');
      }

      let userStatusResp = response['ous:getUserStatusResponse'];
      if (userStatusResp.hasOwnProperty('ous:getUserStatusError')) {
        throw new Error(userStatusResp['ous:getUserStatusError']);
      }

      if (!userStatusResp.hasOwnProperty('ous:userStatus')) {
        throw new Error('Error in response from user status!');
      }

      userStatusResp = Array.isArray(userStatusResp['ous:userStatus']) ? userStatusResp['ous:userStatus'][0] : userStatusResp['ous:userStatus'];

      if (userStatusResp.hasOwnProperty('ous:orderedItems')) {
        const orders = (Array.isArray(userStatusResp['ous:orderedItems']) ? userStatusResp['ous:orderedItems'][0] : userStatusResp['ous:orderedItems'])['ous:order'] || [];
        data.result.orders = orders.map((orderRes) => {
          let order = {
            author: '',
            title: '',
            orderDate: '',
            orderId: '',
            orderStatus: '',
            orderType: '',
            pickupDate: '',
            pickupExpires: '',
            pickupAgency: '',
            ready: false
          };

          const keysToMap = {
            'ous:author': 'author',
            'ous:title': 'title',
            'ous:orderDate': 'orderDate',
            'ous:orderId': 'orderId',
            'ous:orderStatus': 'orderStatus',
            'ous:orderType': 'orderType',
            'ous:pickUpDate': 'pickupDate',
            'ous:pickUpExpiryDate': 'pickupExpires',
            'ous:pickUpAgency': 'pickupAgency'
          };

          Object.keys(keysToMap).forEach((prop) => {
            if (orderRes.hasOwnProperty(prop)) {
              order[keysToMap[prop]] = Array.isArray(orderRes[prop]) ? orderRes[prop][0] : orderRes[prop];
            }
          });

          if (order.pickupDate.length > 0 && order.pickupExpires.length > 0) {
            let now = Date.now();
            let pickupDate = (new Date(order.pickupDate)).getTime();
            let pickupExpires = (new Date(order.pickupExpires)).getTime();

            order.ready = !!(now - pickupDate > 0 && pickupExpires - now > 0);
          }

          return order;
        });
      }
    }
    catch (err) {
      data.errors.push(err.message || err);
    }

    return data;
  }

};

export default GetUserStatusTransform;
