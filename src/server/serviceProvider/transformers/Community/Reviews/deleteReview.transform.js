import {validateId} from './../../../../utils/validateId.util';

const DeleteReviewTransform = {

  event() {
    return 'deleteReview';
  },

  requestTransform(event, query, connection) { // eslint-disable-line no-unused-vars
    if (connection.request.session.passport) {
      // If user is logged in create the post
      const passport = connection.request.session.passport;
      const params = {
        id: query.id,
        accessToken: passport.user.id
      };

      const pid = validateId(query.pid);

      return this.callServiceClient('community', 'markReviewAsDeleted', params)
        .then(() => {
          if (pid.type === 'pid') {
            return this.invalidateCache(`*Reviews*${query.pid}*`);
          }

          return Promise.resolve();
        });
    }
    // If user is not logged in return an error
    return Promise.reject(new Error('user not logged in'));
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    if (response.statusCode !== 200) {
      throw new Error('Call to community service, with method deletePost failed');
    }
    return JSON.parse(response.body);
  }
};

export default DeleteReviewTransform;
