const CreateReviewTransform = {
  event() {
    return 'createReview';
  },

  upsertContent(query, user) {
    if (query.imageRemoveId) {
      this.callServiceClient('community', 'removeImage', {imageId: query.imageRemoveId});
    }


    if (user.profileId === parseInt(query.reviewownerid, 10) || user.profile.profile.isModerator) {
      return this.callServiceClient('community', 'createReview', {
        id: query.id || null,
        libraryid: query.libraryid,
        pid: query.pid,
        content: query.content,
        worktype: query.worktype,
        rating: query.rating,
        created: query.created || (new Date().toUTCString()),
        modified: (new Date().toUTCString()),
        reviewownerid: query.reviewownerid || user.profileId,  // assume that reviewowner is allready set when moderated
        video: query.video
      }).then(response => {
        if (query.imageId) {
          return this.callServiceClient('community', 'updateImageCollection', {
            id: query.imageId,
            reviewImageCollection: response.body.id
          }).then(() => response);
        }

        return response;
      });
    }
    return {};
  },

  requestTransform(event, query, connection) {
    const user = Object.assign({}, connection.request.session.passport.user);

    const me = this;
    if (query.id) {
      return this.upsertContent(query, user);
    }

    const ownerId = query.reviewownerid || user.profileid;
    return this.callServiceClient('community', 'getReviews', {
      filter: {
        where: {
          reviewownerid: ownerId,
          pid: query.pid,
          markedAsDeleted: null
        }
      }
    }).then(response => {
      let reviews = JSON.parse(response.body);

      if (reviews.length === 0) {
        return me.upsertContent(query, user);
      }
      response.errors = [{
        errorMessage: 'Eksisterende anmeldelse'
      }];
      return response;
    });
  },

  responseTransform(response) {
    return {status: response.statusCode, data: response.body, errors: response.errors || []};
  }
};

export default CreateReviewTransform;
