/**
 * @file: This file contains handlers for change streams
 */

/**
 * This is the handler for the quarantines change stream, it creates user messages when a quarantine is created.
 * @param {Object} app
 * @param {*} err
 * @param {PlainObject} change
 */
export function quarantinesChangeStreamHandler(app, err, change) {
  const logger = app.get('logger');
  const checkForNewQuarantinesQueue = app.get('checkForNewQuarantinesQueue');

  if (change && change.data && change.data.quarantinedProfileId && change.type === 'create') {
    checkForNewQuarantinesQueue.add({userId: change.data.quarantinedProfileId});
  }
  else if (change && change.type) {
    logger.info('Got change, but it was not create, doing nothing.');
  }
  else if (err) {
    logger.error('Got error in quarantine change handler', err);
  }
  else {
    logger.error('Quarantine change handler triggered, but got incorrect args!');
  }
}

export function commentWasAddedUserMessageChangeStreamHandler(app, err, change) {
  const logger = app.get('logger');
  const addedCommentQueue = app.get('addedCommentQueue');

  if (change && change.type === 'create' && change.data && change.data.postid && change.data.commentownerid && change.data.id) {
    addedCommentQueue.add({postId: change.data.postid, creatorId: change.data.commentownerid, commentId: change.data.id});
  }
  else if (change && change.type) {
    logger.info('Got change, but it was not create, doing nothing.');
  }
  else if (err) {
    logger.error('Got error in commentWasAdded handler', err);
  }
  else {
    logger.error('commentWasAdded but got wrong args');
  }
}

export function postWasAddedEmitToClientsChangeStreamHandler(app, scServer, err, change) {
  if (change && change.data && change.data.groupid) {
    scServer.exchange.publish(`new_group_content-${change.data.groupid}`, change.data, () => {});
  }
}

export function commentWasAddedEmitToClientsChangeStreamHandler(app, scServer, err, change) {
  if (change && change.data && change.data.postid) {
    const sp = app.get('serviceProvider');
    Promise.all(sp.trigger('getSinglePosts', {id: change.data.postid, filter: {include: []}})).then((result) => {
      const post = result[0];
      scServer.exchange.publish(`new_group_content-${post.groupid}`, change.data, () => {});
    });
  }
}
