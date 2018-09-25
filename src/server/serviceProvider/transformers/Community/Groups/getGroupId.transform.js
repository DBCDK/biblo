const GetGroupTransform = {
  event() {
    return 'getGroupId';
  },
  // eslint-disable-next-line no-unused-vars
  requestTransform(event, {id, type}, connection) {
    if (!id) {
      return Promise.reject(new Error('No id provided'));
    }
    switch (type) {
      case 'comment':
        return this.callServiceClient('community', 'getComments', {
          filter: {
            where: {id: id}
          }
        }).then(res => {
          return this.callServiceClient('community', 'getPosts', {
            filter: {
              where: {id: JSON.parse(res.body)[0].postid}
            }
          });
        });
      case 'post':
        return this.callServiceClient('community', 'getPosts', {
          filter: {
            where: {id}
          }
        });
      default:
        throw new Error('Unrecognized type!');
    }
  },

  responseTransform(response) {
    let post = JSON.parse(response.body)[0];
    return {
      body: {
        groupid: post.groupid,
        postid: post.id
      },
      statusCode: response.statusCode,
      statusMessage: response.statusMessage
    };
  }
};

export default GetGroupTransform;
