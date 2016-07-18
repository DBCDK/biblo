import crypto from 'crypto';

const GetUserStatusTransform = {
  /**
   * Hashes the given string using the md5 algorithm
   *
   * @param string The string that shouldbe hashed.
   * @return {String}
   */
  md5(string) {
    return crypto
      .createHash('md5')
      .update(string)
      .digest('hex');
  },

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
    const data = {
      result: {
        orders: [],
        loans: [],
        fiscal: {
          totalAmount: '',
          transactions: []
        }
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
      const now = Date.now();

      if (userStatusResp.hasOwnProperty('ous:orderedItems')) {
        const orders = (Array.isArray(userStatusResp['ous:orderedItems']) ? userStatusResp['ous:orderedItems'][0] : userStatusResp['ous:orderedItems'])['ous:order'] || [];
        data.result.orders = orders.map((orderRes) => {
          const order = {
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

          const orderStatus = order.orderStatus || '';

          if (order.pickupDate.length > 0 && order.pickupExpires.length > 0) {
            const pickupDate = (new Date(order.pickupDate)).getTime();
            const pickupExpires = (new Date(order.pickupExpires)).getTime();

            order.ready = !!(now - pickupDate > 0 && pickupExpires - now > 0);
          }
          else if (orderStatus.toLowerCase() === 'available for pickup') {
            order.ready = true;
          }

          return order;
        });
      }

      if (userStatusResp.hasOwnProperty('ous:loanedItems')) {
        const loans = (Array.isArray(userStatusResp['ous:loanedItems']) ? userStatusResp['ous:loanedItems'][0] : userStatusResp['ous:loanedItems'])['ous:loan'] || [];
        data.result.loans = loans.map((loanRes) => {
          const loan = {
            author: '',
            title: '',
            dateDue: '',
            loanId: '',
            expiresSoon: false
          };

          const keysToMap = {
            'ous:author': 'author',
            'ous:title': 'title',
            'ous:dateDue': 'dateDue',
            'ous:loanId': 'loanId'
          };

          Object.keys(keysToMap).forEach((prop) => {
            if (loanRes.hasOwnProperty(prop)) {
              loan[keysToMap[prop]] = Array.isArray(loanRes[prop]) ? loanRes[prop][0] : loanRes[prop];
            }
          });

          if (loan.dateDue && loan.dateDue.length > 0) {
            try {
              const dueDate = new Date(loan.dateDue);
              loan.expiresSoon = (dueDate.getTime() - 172800000 <= now);
            }
            catch (err) {
              data.errors.push('could not parse date.');
            }
          }

          return loan;
        });
      }

      if (userStatusResp.hasOwnProperty('ous:fiscalAccount')) {
        const fiscals = userStatusResp['ous:fiscalAccount'][0];

        // Totals
        const currency = (fiscals['ous:totalAmountCurrency'] || ['DKK'])[0];
        const totalAmount = (fiscals['ous:totalAmout'] || ['0'])[0];
        data.result.fiscal.totalAmount = `${totalAmount} ${currency}`;

        // Individual transactions
        (fiscals['ous:fiscalTransaction'] || []).forEach((transaction) => {
          const bill = {
            amount: '',
            currency: '',
            date: '',
            type: '',
            author: '',
            title: '',
            id: ''
          };

          bill.amount = (transaction['ous:fiscalTransactionAmount'] || [])[0] || '';
          bill.currency = (transaction['ous:fiscalTransactionCurrency'] || [])[0] || '';
          bill.date = (transaction['ous:fiscalTransactionDate'] || [])[0] || '';
          bill.type = (transaction['ous:fiscalTransactionType'] || [])[0] || '';
          bill.author = (transaction['ous:author'] || [])[0] || '';
          bill.title = (transaction['ous:title'] || [])[0] || '';
          bill.id = this.md5(JSON.stringify(bill));

          data.result.fiscal.transactions.push(bill);
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
