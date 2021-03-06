const CreateReviewTransform = {
  event() {
    return 'createReview';
  },

  upsertContent(query, user) {
    if (query.imageRemoveId) {
      this.callServiceClient('community', 'removeImage', {imageId: query.imageRemoveId});
    }

    if (user.profileId === parseInt(query.reviewownerid, 10) || user.profile.profile.isModerator) {
      const created = query.id ? query.created : new Date().toUTCString();

      return new Promise((resolve, reject) => {
        if (user.profile.profile.isModerator) {
          resolve();
        }

        // if the review exists and user is not moderator,
        // we got to check that the profile actually owns the review
        if (query.id) {
          this.callServiceClient('community', 'getReviews', {
            filter: {where: {id: query.id}}
          }).then(response => {
            if (response.body && response.body.length) {
              if (response.body[0].reviewownerid === user.profileId) {
                resolve();
              }
            }
            reject(`Could not upsert, ${query.reviewownerid} does not own review ${query.id}`);
          });
        } else {
          resolve();
        }
      }).then(() => {
        return this.callServiceClient('community', 'createReview', {
          id: query.id || null,
          libraryid: query.libraryid,
          pid: query.pid,
          content: query.content,
          worktype: query.worktype,
          rating: query.rating,
          created,
          modified: new Date().toUTCString(),
          reviewownerid: query.reviewownerid || user.profileId, // assume that reviewowner is allready set when moderated
          video: query.video
        })
          .then(response => {
            if (query.imageId) {
              return this.callServiceClient('community', 'updateImageCollection', {
                id: query.imageId,
                reviewImageCollection: response.body.id
              }).then(() => response);
            }

            return response;
          })
          .then(response => {
            return Promise.all([
              response,
              this.callServiceClient('cached/standard/openplatform', 'work', {
                pids: [query.pid],
                fields: ['subjectDBCS', 'subjectGenre']
              })
            ]);
          })
          .then(responses => {
            const work = JSON.parse(responses[1].body).data[0];
            const subjects = work.subjectDBCS || [];
            const genres = work.subjectGenre || [];
            const promises = [responses[0], this.invalidateCache(`*Reviews*${query.pid}*`)];
            if (genres.length) {
              promises.push(
                this.callServiceClient('community', 'addGenres', {
                  reviewId: responses[0].body.id,
                  genres: genres.join(',')
                })
              );
            }
            if (subjects.length) {
              promises.push(
                this.callServiceClient('community', 'addSubjects', {
                  reviewId: responses[0].body.id,
                  subjects: subjects.join(',')
                })
              );
            }
            return Promise.all(promises);
          })
          .then(responses => {
            return responses[0];
          });
      });
    }
    return {};
  },

  requestTransform(event, query, connection) {
    const user = Object.assign({}, connection.request.session.passport.user);
    return this.upsertContent(query, user);
  },

  responseTransform(response) {
    return {status: response.statusCode, data: response.body, errors: response.errors || []};
  }
};

export default CreateReviewTransform;
