/**
 * @file: This file contains handlers for change streams
 */

/**
 * This is the handler for the quarantines change stream, it creates user messages when a quarantine is created.
 * @param {Object} app
 * @param {*} err
 * @param {PlainObject} change
 */
export function quarantinesChangeStreamHandler(app, change = {}) {
  const checkForNewQuarantinesQueue = app.get('checkForNewQuarantinesQueue');

  if (change.data && change.data.quarantinedProfileId && change.isNewInstance) {
    checkForNewQuarantinesQueue.add({userId: change.data.quarantinedProfileId});
  }
}

export function commentWasAddedUserMessageChangeStreamHandler(app, change = {}) {
  const addedCommentQueue = app.get('addedCommentQueue');

  if (change.isNewInstance && change.data && change.data.postid && change.data.commentownerid && change.data.id) {
    addedCommentQueue.add({postId: change.data.postid, creatorId: change.data.commentownerid, commentId: change.data.id});
  }
}

export function postWasAddedEmitToClientsChangeStreamHandler(app, scServer, change = {}) {
  if (change.data && change.data.groupid) {
    scServer.exchange.publish(`new_group_content-${change.data.groupid}`, change.data, () => {});
  }
}

export function commentWasAddedEmitToClientsChangeStreamHandler(app, scServer, change = {}) {
  if (change.data && change.data.postid) {
    const sp = app.get('serviceProvider');
    Promise.all(sp.trigger('getSinglePosts', {id: change.data.postid, filter: {include: []}})).then((result) => {
      const post = result[0];
      scServer.exchange.publish(`new_group_content-${post.groupid}`, change.data, () => {});
    });
  }
}
