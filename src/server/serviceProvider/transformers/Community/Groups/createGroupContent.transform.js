'use strict';

const CreateGroupContent = {
  event() {
    return 'createGroupContent';
  },

  upsertContent(query, user) {
    const method = query.type === 'post' && 'createPost' || 'createComment';

    if (query.removeImage) {
      this.callServiceClient('community', 'removeImage', {imageId: query.removeImage});
    }

    return this.callServiceClient('community', method, {
      title: query.title || '',
      content: query.content || '',
      timeCreated: query.timeCreated || (new Date()).toUTCString(),
      parentId: query.parentId,
      id: query.id || null,
      uid: user.profileId,
      ownerid: query.ownerid || user.profileId,
      accessToken: user.id
    }).then((response) => {
      if (response.statusCode === 200 && query.image) {
        const image = query.image;
        query.image = {data: 'Binary Image Data!'};
        return this.callServiceClient('community', 'updateImage', {
          relationId: response.body.id,
          image,
          accessToken: user.id,
          relationType: query.type === 'post' && 'postImageCollection' || 'commentImageCollection'
        }).then(() => {
          return response;
        });
      }

      return response;
    });
  },

  getSingleContent(query, user) {
    const filter = {
      where: {id: query.id},
      include: ['image']
    };
    const method = query.type === 'post' && 'getPosts' || 'getComments';
    return this.callServiceClient('community', method, {filter: filter}).then(response => {
      const post = JSON.parse(response.body)[0];
      if (!post) {
        return Promise.reject(new Error('content does not exists'));
      }
      const ownerId = query.type === 'post' && post.postownerid || post.commentownerid;
      if (ownerId !== user.profileId) {
        return Promise.reject(new Error('user does not have access to edit content'));
      }

      query.ownerId = ownerId;
      query.timeCreated = post.timeCreated;
      query.removeImage = query.imageRemoved && post.image.id || false;
      return query;
    });
  },

  requestTransform(event, query, connection) { // eslint-disable-line no-unused-vars
    // If user is not logged in create the post
    if (!connection.request.session.passport) {
      return Promise.reject(new Error('user not logged in'));
    }
    const user = connection.request.session.passport.user;

    // If id is set content is being editted. Check if user has access to edit content
    if (query.id) {
      return this.getSingleContent(query, user).then(reponseQuery => this.upsertContent(reponseQuery, user));
    }

    return this.upsertContent(query, user);
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
