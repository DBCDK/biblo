const GetGroupTransform = {
  event() {
    return 'getGroupId';
  },

  requestTransform(event, {id, type}, connection) { // eslint-disable-line no-unused-vars
    switch (type) {
      case 'comment':
        return this.callServiceClient('community', 'getComments', {
          filter: {
            where: {id: id}
          }
        }).then((res) => {
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
