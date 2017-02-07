const CreateGroupContent = {
  event() {
    return 'createGroupContent';
  },

  upsertContent(query, user) {
    const imageCollectionQuery = {
      id: query.imageId
    };

    let method;
    let imageCollectionField;

    if (query.type === 'post') {
      method = 'createPost';
      imageCollectionField = 'postImageCollection';
    }
    else {
      method = 'createComment';
      imageCollectionField = 'commentImageCollection';
    }

    // Fire and forget for image delete.
    if (query.removeImage) {
      this.callServiceClient('community', 'removeImage', {imageId: query.removeImage});
    }

    // Fire and forget for pdf delete.
    if (query.removePdf) {
      this.callServiceClient('community', 'removePdf', {pdfId: query.removePdf});
    }

    return this.callServiceClient('community', method, {
      title: query.title || '',
      content: query.content || '',
      timeCreated: query.timeCreated || (new Date()).toUTCString(),
      parentId: query.parentId,
      attachedReviewId: query.attachedReviewId,
      id: query.id || null,
      uid: user.profileId,
      ownerid: query.ownerid || user.profileId,
      accessToken: user.id,
      video: query.video || null,
      pdf: query.pdf || null
    }).then(response => {
      if (query.imageId) {
        imageCollectionQuery[imageCollectionField] = response.body.id;
        return this.callServiceClient('community', 'updateImageCollection', imageCollectionQuery).then(() => response);
      }

      return response;
    });
  },

  getSingleContent(query, user) {
    return this.callServiceClient('community', 'checkIfProfileIsQuarantined', user.profileId).then((quarantine) => {
      if (JSON.parse(quarantine.body).quarantined) {
        return Promise.reject(new Error('user is quarantined'));
      }

      const filter = {
        where: {id: query.id},
        include: ['image', 'pdf']
      };
      const method = query.type === 'post' && 'getPosts' || 'getComments';
      return this.callServiceClient('community', method, {filter: filter}).then(response => {
        const post = JSON.parse(response.body)[0];
        if (!post) {
          return Promise.reject(new Error('content does not exists'));
        }
        const ownerId = query.type === 'post' && post.postownerid || post.commentownerid;
        if (user.profile.profile.isModerator) {
          user.profileId = ownerId;
        }
        else if (ownerId !== user.profileId) {
          return Promise.reject(new Error('user does not have access to edit content'));
        }

        query.ownerId = ownerId;
        query.timeCreated = post.timeCreated;
        query.removeImage = query.imageRemoved && post.image.id || false;
        query.removePdf = query.pdfRemoved && post.pdf && post.pdf.id || false;
        return query;
      });
    });
  },

  requestTransform(event, query, connection) { // eslint-disable-line no-unused-vars
    // If user is not logged in create the post
    if (!connection.request.session.passport) {
      return Promise.reject(new Error('user not logged in'));
    }
    const user = Object.assign({}, connection.request.session.passport.user);

    // If id is set content is being editted. Check if user has access to edit content
    if (query.id) {
      return this.getSingleContent(query, user).then(reponseQuery => this.upsertContent(reponseQuery, user));
    }

    return this.callServiceClient('community', 'checkIfProfileIsQuarantined', user.profileId).then((quarantine) => {
      if (JSON.parse(quarantine.body).quarantined) {
        return Promise.reject(new Error('user is quarantined'));
      }

      return this.upsertContent(query, user);
    });
  },

  responseTransform(response, query, connection) { // eslint-disable-line no-unused-vars
    // @todo handle errors
    let result = false;
    if (response.statusCode === 200) {
      result = response.body;
    }

    return result;
  }
};

export default CreateGroupContent;
