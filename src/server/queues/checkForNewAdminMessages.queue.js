/**
 * @file: In this file we check a users messages to report the to him/her.
 */

export function processCheckForNewAdminMessages(job, done) {
  return new Promise((resolve, reject) => {
    // eslint-disable-line consistent-return
    const app = job.app;
    const serviceProvider = app.get('serviceProvider');
    const userMessageAdd = app.get('userMessageAdd');

    if (!job.data || !job.data.userId) {
      return reject(new Error('Required props were not found! All we need is a userId!'));
    }

    const getAdminMessagesPromise = serviceProvider.trigger('getAdminMessages', {
      uid: job.data.userId
    });

    const getUserMessagesPromise = serviceProvider.trigger('getUserMessages', job.data.userId);

    Promise.all(getAdminMessagesPromise.concat(getUserMessagesPromise))
      .then(serviceProviderData => {
        const userMessages = serviceProviderData[1];
        const adminMessages = serviceProviderData[0].body;
        if (!adminMessages) {
          return reject('Could not get admin messages');
        }

        let reportedAdminMessages = [];

        userMessages.Items.forEach(Item => {
          if (Item.messageType === 'type-messageFromAdmin' && Item.id) {
            reportedAdminMessages.push(Item.id);
          }
        });

        adminMessages.forEach(am => {
          // check if the user has already been notified.
          if (reportedAdminMessages.indexOf(am.id) < 0) {
            userMessageAdd(job.data.userId, 'messageFromAdmin', am);
          }
        });

        return resolve(adminMessages);
      })
      .catch(reject);
  }).then(res => done(null, res), err => done(err));
}
