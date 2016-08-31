/**
 * @file: In this file we check user status.
 */

import {includes, flatMap} from 'lodash';

/**
 * Filtering the given userMessages.
 *
 * If an item is found in userMessages but not in userStatus it will be removed from userMessages and requested
 * 'markAsDeleted' through the serviceProvider.
 *
 * @param {*} userMessages
 * @param {*} userStatus
 * @param {Object} serviceProvider
 * @returns {Array.<*>}
 */
export function filterItems(userMessages, userStatus, serviceProvider) {
  // Flatten the object to ensure it is iteratable
  const userStatusFlattened = flatMap(userStatus);

  // Iterate the userMessages coming from DynamoDB
  return userMessages.Items.filter((item) => {
    let keepItem = true;

    if ((item.orderId || item.loanId) && !item.markAsDeleted) {
      const id = item.orderId || item.loanId;
      let wasFound = false;

      // Iterate the userStatusFlattened and check if the current item.id is present
      userStatusFlattened.forEach((userStatusItem) => {
        if (includes(userStatusItem, id)) {
          wasFound = true;
        }
      });

      // If the current item.id is not found remove it from the userMessages object and mark it as deleted in DynamoDB
      if (!wasFound) {
        serviceProvider.trigger('deleteUserMessage', item);
        keepItem = false;
      }
    }

    return keepItem;
  });
}

export function processUserStatusCheck(job, done) {
  return new Promise((resolve, reject) => { // eslint-disable-line consistent-return
    const app = job.app;
    const serviceProvider = app.get('serviceProvider');
    const userMessageAdd = app.get('userMessageAdd');
    const logger = app.get('logger');

    if (
      !job.data || !job.data.favoriteLibrary || !job.data.favoriteLibrary.libraryId || !job.data.favoriteLibrary.pincode || !job.data.favoriteLibrary.loanerId || !job.data.userId
    ) {
      return reject(new Error('Required props were not found, try add more data!'));
    }

    logger.info('About to check user status for:', {userId: job.data.userId});

    const getUserStatusPromise = serviceProvider.trigger('getUserStatus', {
      agencyId: job.data.favoriteLibrary.libraryId,
      userId: job.data.favoriteLibrary.loanerId,
      pinCode: job.data.favoriteLibrary.pincode
    });

    const getUserMessagesPromise = serviceProvider.trigger('getUserMessages', job.data.userId);

    Promise.all(getUserStatusPromise.concat(getUserMessagesPromise)).then((serviceProviderData) => {
      const userMessages = serviceProviderData[1];
      const userStatus = serviceProviderData[0].result;

      if (!userStatus) {
        return reject('Could not get user status');
      }

      logger.info('Got user status for user:', {userId: job.data.userId});

      const loanedItemsLoanIds = [];
      const readyItemsOrderIds = [];
      const registeredTransactions = [];

      // Remove userstatus items from userMessages ig they are no longer present in userStatus and mark them as deleted in Dynamo
      userMessages.Items = filterItems(userMessages, userStatus, serviceProvider);

      // First we check our messages to ensure we don't create duplicates
      userMessages.Items.forEach((Item) => {

        // Messages for user status orders
        if (Item.messageType === 'type-orderIsReady' && Item.orderId && Item.orderId.length > 0) {
          readyItemsOrderIds.push(Item.orderId);
        }

        // Messages for user status loans
        if (Item.messageType === 'type-orderExpiresSoon' && Item.loanId && Item.loanId.length > 0) {
          loanedItemsLoanIds.push(Item.loanId);
        }

        if (Item.messageType === 'type-userTransaction' && Item.id && Item.id.length > 0) {
          registeredTransactions.push(Item.id);
        }
      });

      // Next we check the user status for orders that are ready, and create new messages if applicable
      if (userStatus.orders && userStatus.orders.length > 0) {
        userStatus.orders.forEach((order) => {
          if (order.ready && readyItemsOrderIds.indexOf(order.orderId) < 0) {
            userMessageAdd(job.data.userId, 'orderIsReady', order);
          }
        });
      }

      // And we check the user status loans to see if any are about to, or have already, expired.
      if (userStatus.loans && userStatus.loans.length > 0) {
        userStatus.loans.forEach((loan) => {
          if (loan.expiresSoon && loanedItemsLoanIds.indexOf(loan.loanId) < 0) {
            userMessageAdd(job.data.userId, 'orderExpiresSoon', loan);
          }
        });
      }

      // Finally we check a users transactions, to see if any new ones have been created.
      if (userStatus.fiscal && userStatus.fiscal.transactions && userStatus.fiscal.transactions.length > 0) {
        userStatus.fiscal.transactions.forEach(transaction => {
          if (transaction.id && registeredTransactions.indexOf(transaction.id) < 0) {
            transaction.total = userStatus.fiscal.totalAmount;
            userMessageAdd(job.data.userId, 'userTransaction', transaction);
          }
        });
      }

      return resolve(userStatus);
    }).catch(reject);
  }).then((res) => done(null, res), (err) => done(err));
}
