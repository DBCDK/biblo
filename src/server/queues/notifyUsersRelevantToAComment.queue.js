/**
 * @file: In this file we notify users when a new comment has been created.
 */

export function notifyUsersRelevantToComment(job, done) {
  return new Promise((resolve, reject) => {
    const app = job.app;
    const serviceProvider = app.get('serviceProvider');
    const userMessageAdd = app.get('userMessageAdd');

    if (job.data && job.data.postId && job.data.creatorId && job.data.commentId) {
      return Promise.all(serviceProvider.trigger('getSinglePosts', {id: job.data.postId})).then((result) => {
        const post = result[0];

        let peopleToNotify = [post.postownerid];
        post.comments.forEach(c => {
          if (peopleToNotify.indexOf(c.commentownerid) < 0) {
            peopleToNotify.push(c.commentownerid);
          }
        });

        if (peopleToNotify.indexOf(job.data.creatorId) > -1) {
          // remove the creator from the people to notify.
          peopleToNotify.splice(peopleToNotify.indexOf(job.data.creatorId), 1);
        }

        peopleToNotify.forEach((personId) => {
          userMessageAdd(personId, 'commentWasAdded', job.data);
        });

        return resolve({notified: peopleToNotify});
      });
    }

    return reject('invalid parameters');
  }).then((res) => done(null, res), (err) => done(err));
}
