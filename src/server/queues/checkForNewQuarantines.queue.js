/**
 * @file: In this file we check a users quarantines to report the to him/her.
 */

export function processCheckForNewQuarantines(job, done) {
  return new Promise((resolve, reject) => { // eslint-disable-line consistent-return
    const app = job.app;
    const serviceProvider = app.get('serviceProvider');
    const userMessageAdd = app.get('userMessageAdd');

    if (!job.data || !job.data.userId) {
      return reject(new Error('Required props were not found! All we need is a userId!'));
    }

    const getQuarantinesPromise = serviceProvider.trigger('getQuarantines', {
      uid: job.data.userId
    });

    const getUserMessagesPromise = serviceProvider.trigger('getUserMessages', job.data.userId);

    Promise.all(getQuarantinesPromise.concat(getUserMessagesPromise)).then((serviceProviderData) => {
      console.log('spdata:', serviceProviderData);

      const userMessages = serviceProviderData[1];
      const quarantines = serviceProviderData[0].body;

      if (!quarantines) {
        return reject('Could not get quarantines');
      }

      let reportedQuarantines = [];

      userMessages.Items.forEach((Item) => {
        if (Item.messageType === 'type-userWasQuarantined' && Item.id) {
          reportedQuarantines.push(Item.id);
        }
      });

      quarantines.forEach((qu) => {
        // check if the user has already been notified.
        if (reportedQuarantines.indexOf(qu.id) < 0) {
          userMessageAdd(job.data.userId, 'userWasQuarantined', qu);
        }
      });

      return resolve(quarantines);
    }).catch(reject);
  }).then((res) => done(null, res), (err) => done(err));
}
