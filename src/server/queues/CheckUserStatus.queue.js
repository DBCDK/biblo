/**
 * @file: In this file we check user status.
 */

export function processUserStatusCheck(job, done) {
  return new Promise((resolve, reject) => {
    const app = job.app;
    const serviceProvider = app.get('serviceProvider');
    const userMessageAdd = app.get('userMessageAdd');

    if (
      !job.data || !job.data.favoriteLibrary || !job.data.favoriteLibrary.libraryId ||
      !job.data.favoriteLibrary.pincode || !job.data.favoriteLibrary.loanerId || !job.data.userId
    ) {
      return reject(new Error('Required props were not found, try add more data!'));
    }

    const getUserStatusPromise = serviceProvider.trigger('getUserStatus', {
      agencyId: job.data.favoriteLibrary.libraryId,
      userId: job.data.favoriteLibrary.loanerId,
      pinCode: job.data.favoriteLibrary.pincode
    });

    const getUserMessagesPromise = serviceProvider.trigger('getUserMessages', job.data.userId);

    Promise.all(getUserStatusPromise.concat(getUserMessagesPromise)).then((serviceProviderData) => {
      const userMessages = serviceProviderData[1];
      const userStatus = serviceProviderData[0].result;

      let readyItemsOrderIds = [];

      userMessages.Items.forEach((Item) => {
        if (Item.messageType === 'type-orderIsReady') {
          (Item.Messages || []).forEach((message) => {
            if (message.orderId && message.orderId.length > 0) {
              readyItemsOrderIds.push(message.orderId);
            }
          });
        }
      });

      if (!userStatus) {
        return reject('Could not get user status');
      }

      if (userStatus.orders && userStatus.orders.length > 0) {
        userStatus.orders.forEach((order) => {
          if (order.ready && readyItemsOrderIds.indexOf(order.orderId) < 0) {
            userMessageAdd(job.data.userId, 'orderIsReady', order);
          }
        });
      }

      return resolve(userStatus);
    }).catch(reject);
  }).then((res) => done(null, res), (err) => done(err));
}
