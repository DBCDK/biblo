const request = require('request');
const uuid = require('node-uuid');
const http = require('http');
const url_parser = require('url').parse;
const forever = require('async/forever');

/**
 * This is a helper function to create an infinite long polling listener on a change stream
 * @param {String} endpoint
 * @param {String} model
 * @param {Function || Array[Function]} callback
 * @param {Object} logger
 * @returns {Promise}
 */
function changeStreamListener(endpoint, model, callback, logger) {
  // Return a promise so the serviceprovider is happy
  return new Promise((resolve) => {
    // Parse out the url for the change stream and add a keep-alive agent to it.
    const opts = url_parser(`${endpoint}api/${model}/change-stream?_format=event-stream`);
    opts.agent = new http.Agent({keepAlive: true});

    // This regex helps us get the name of the event, and stores it in currentEvent.
    const eventRegex = /^event: ([a-zA-Z]+)/;
    let currentEvent = 'someunidentifiedevent: ';

    // We want to ensure the promise is only resolved once, despite the retry logic, to avoid error...
    let resolved = false;

    // The callback can be a function, or an array of functions, therefore we have some logic to handle both situations as a single function.
    let cb = callback;
    if (Array.isArray(callback)) {
      cb = (err, res) => {
        callback.forEach((cbf) => cbf(err, res));
      };
    }

    // We use backoff to ensure we don't block the event loop.
    let timeout = 0; // start at 0, as we don't want a timeout on the first (re)connect.
    const timeoutIncrement = 100; // increment the timeout by 100 ms per failure.
    const maxTimeout = 60000; // We want a max of one minute.

    // The magic starts here, this is an async loop which runs forever, to ensure whenever we loose a connection, it is reestablished automatically.
    forever(retry => {
      // We construct a handler for both end and error
      const retryHandler = (err) => {
        if (err) {
          // An error occurred, so we log it.
          logger.error(`got error from ${model} change stream, retrying`, err);
        }
        else {
          // The stream end regularly (The unfortunate nature of long polling), so we log it.
          logger.info(`${model} stream ended, retrying`);
        }

        // Retry with backoff.
        setTimeout(() => {
          if (timeout < maxTimeout) { // We want a max of one minute.
            timeout += timeoutIncrement;
          }
          retry();
        }, timeout);
      };

      // we now insert the url with the keepAlive on, and make a get request.
      http.get(opts, response => {
        // Whenever we get some data, we want to start parsing it.
        response.on('data', d => {
          // we got data, so reset the timeout
          timeout = 0;

          // d is a buffer, so we convert it to a string.
          const dataString = d.toString();

          // The ACK signal of the stream is :ok
          // This tells us the listener has begun
          if (dataString.indexOf(':ok') === 0) {
            if (!resolved) {
              resolved = true;
              resolve({created: true});
            }

            logger.info(`Started listening to ${model}`);
          }
          // Whenever a change occurs, we first get an event, we use this to help us parse the change.
          else if (dataString.indexOf('event: ') === 0) {
            currentEvent = `${eventRegex.exec(dataString)[1]}: `;
          }
          // After we got the event, we want to respond to it
          // We do this by calling our callback(s) with a parsed version of the event.
          else if (dataString.indexOf(currentEvent) === 0) {
            const jsonData = JSON.parse(dataString.substring(currentEvent.length));
            cb(null, jsonData);
          }
          // If the above scenarios can't parse the data, something unexpected has happened.
          else {
            cb('something weird happened');
          }
        });

        // If the connection is inactive, the connection is dropped, so we want to restart it
        // Whenever an error occurs, we want to log the error, and retry the stream.
        // This is where we get stuff like ECONNREFUSED ie. if the service is redeploying.
        response.on('end', retryHandler);
        response.on('error', retryHandler);
      }).on('error', retryHandler);
    });
  });
}

/**
 * A helper function to create a promise which resolves to the http response.
 * @param {String} method - Method to use when executing the request.
 * @param {PlainObject} req - Request object that is passed to the request method.
 * @returns {Promise}
 */
function promiseRequest(method, req) {
  return new Promise((resolve, reject) => {
    request[method](req, (err, httpResponse) => {
      if (err) {
        reject(err, httpResponse);
      }
      else {
        resolve(httpResponse);
      }
    });
  });
}

function loginAndGetProfile(endpoint, {username, timestamp, authtoken, ttl}) {
  return promiseRequest('post', {
    url: `${endpoint}api/Profiles/unilogin`,
    form: {username, timestamp, authtoken, ttl}
  });
}

function checkIfUserProfileExists(endpoint, params) {
  return promiseRequest('post', {
    url: `${endpoint}api/Profiles/checkIfUserExists`,
    form: {
      username: params.username
    }
  });
}

function checkIfDisplayNameIsTaken(endpoint, {displayname}) {
  return promiseRequest('post', {
    url: `${endpoint}api/Profiles/checkIfDisplayNameIsTaken`,
    form: {
      displayname
    }
  });
}

function createProfile(endpoint, {username}) {
  return promiseRequest('post', {
    url: endpoint + 'api/Profiles',
    json: {
      username,
      created: Date.now(),
      lastUpdated: Date.now()
    }
  });
}

function updateProfile(endpoint, {uid, profile, accessToken}) {
  return promiseRequest('put', {
    url: endpoint + 'api/Profiles/' + uid + '?access_token=' + accessToken,
    body: profile,
    json: true
  });
}

function removeImage(endpoint, {imageId, accessToken}) {
  return promiseRequest('del', {
    url: `${endpoint}api/ImageCollections/${imageId}?access_token=${accessToken}`
  });
}

/**
 * Uploads an image to s3 and creates all necessary relations to return an imageCollection object.
 * @param {String} endpoint
 * @param {File} image
 * @param {String} accessToken
 * @param {String} container
 * @returns {Promise}
 */
function uploadImage(endpoint, {image, accessToken, container = 'uxdev-biblo-imagebucket'}) {
  let fileExtension = image.originalname.split('.');
  fileExtension = fileExtension[fileExtension.length - 1];
  const fileName = uuid.v4().replace('-', '') + '.' + fileExtension;

  return promiseRequest('post', {
    url: `${endpoint}api/ImageCollections/upload?access_token=${accessToken}&container=${container}`,
    json: true,
    formData: {
      file: {
        value: image.buffer,
        options: {
          contentType: image.mimetype,
          filename: fileName
        }
      }
    }
  });
}

/**
 * This function updates an image collection, it only allows valid fields to be sent.
 * @param {String} endpoint
 * @param {PlainObject} query
 * @returns {Promise}
 */
function updateImageCollection(endpoint, query) {
  const {id} = query;
  const form = {};
  ['profileImageCollection', 'groupCoverImageCollectionId', 'postImageCollection', 'commentImageCollection', 'reviewImageCollection']
    .forEach(f => {
      if (query[f]) {
        form[f] = query[f];
      }
    });

  return promiseRequest('put', {
    url: `${endpoint}api/ImageCollections/${id}`,
    json: true,
    form
  });
}

function updateImage(endpoint, {image, relationId, relationType, accessToken}) {
  let fileExtension = image.originalname.split('.');
  fileExtension = fileExtension[fileExtension.length - 1];
  const fileName = uuid.v4().replace('-', '') + '.' + fileExtension;

  return promiseRequest('post', {
    url: endpoint + 'api/ImageCollections/upload?access_token=' + accessToken + '&container=uxdev-biblo-imagebucket',
    formData: {
      file: {
        value: image.buffer,
        options: {
          contentType: image.mimetype,
          filename: fileName
        }
      }
    }
  }).then((res) => {
    let remoteFileObject = JSON.parse(res.body);
    let bodyObj = {};
    bodyObj[relationType] = relationId;
    return promiseRequest(
      'put',
      {
        url: endpoint + 'api/ImageCollections/' + remoteFileObject.id + '?access_token=' + accessToken,
        json: true,
        body: bodyObj
      }
    );
  });
}

/**
 * Get Full profile (that is userprofile + image)
 * @param endpoint
 * @param uid
 * @param accessToken
 * @param profileFilter
 */
function getFullProfile(endpoint, {uid, accessToken, profileFilter}) {
  let filter = {
    include: ['image']
  };

  if (profileFilter) {
    filter = Object.assign(filter, profileFilter);
  }

  return promiseRequest('get', {
    url: endpoint + 'api/Profiles/' + uid + '?filter=' + encodeURIComponent(JSON.stringify(filter)) + '&access_token=' + accessToken
  });
}

function getImage(endpoint, {id}) {
  return promiseRequest('get', {
    url: endpoint + 'api/files/' + id
  });
}

function getResizedImage(endpoint, {id, size}) {
  return promiseRequest('get', {
    url: endpoint + 'api/imageCollections/' + id + '/download/' + size
  }).then((httpResponse) => {
    if (httpResponse && httpResponse.statusCode !== 200) {
      return Promise.reject(httpResponse.statusCode, httpResponse);
    }

    return Promise.resolve(httpResponse);
  });
}

/**
 * Lets a user join a group, also used to update when a user last visited a group.
 * @param endpoint
 * @param uid
 * @param groupId
 * @param accessToken
 * @returns {Promise.<TResult>}
 */
function joinGroup(endpoint, {uid, groupId, accessToken}) {
  return promiseRequest('get', {
    url: `${endpoint}api/GroupProfiles?filter=%7B%22where%22%3A%20%7B%22profileid%22%3A${uid}%2C%20%22groupid%22%3A%20${groupId}%7D%7D`,
    json: true
  }).then(following => {
    const putBody = {
      profileid: uid,
      groupid: groupId,
      visited: Date.now()
    };

    if (following.body.length > 0) {
      putBody.id = following.body[0].id;
    }

    return promiseRequest('put', {
      url: `${endpoint}api/GroupProfiles?access_token=${accessToken}`,
      body: putBody,
      json: true
    });
  });
}

/**
 * Lists groups given a filter (no search)
 * No access restrictions .
 *
 * @param endpoint
 * @param params
 * @returns {Promise}
 */
function listGroups(endpoint, params) {
  return new Promise((resolve) => {
    const filter_str = JSON.stringify(params.filter || []);
    const url = endpoint + 'api/Groups/?filter=' + filter_str;
    request.get(
      {
        url: url
      },
      (err, httpResponse) => {
        resolve(httpResponse);
      }
    );
  });
}

function leaveGroup(endpoint, {uid, groupId, accessToken}) {
  return promiseRequest('del', {
    url: endpoint + 'api/Profiles/' + uid + '/groups/rel/' + groupId + '?access_token=' + accessToken,
    json: true
  });
}

function createGroup(endpoint, params) {
  const {name, description, colour, coverImage, uid, accessToken} = params;
  return promiseRequest('post', {
    url: endpoint + 'api/Groups?access_token' + accessToken,
    json: true,
    body: {
      name,
      description,
      colour,
      timeCreated: (new Date()).toUTCString(),
      groupownerid: uid
    }
  }).then((createResult) => {
    let fileExtension = coverImage.originalname.split('.');
    fileExtension = fileExtension[fileExtension.length - 1];
    const fileName = uuid.v4().replace('-', '') + '.' + fileExtension;

    joinGroup(endpoint, {
      uid,
      groupId: createResult.body.id,
      accessToken
    });

    return promiseRequest('post', {
      url: endpoint + 'api/ImageCollections/upload?access_token=' + accessToken + '&container=uxdev-biblo-imagebucket',
      formData: {
        file: {
          value: coverImage.buffer,
          options: {
            contentType: coverImage.mimetype,
            filename: fileName
          }
        }
      }
    }).then((fileResult) => {
      fileResult = JSON.parse(fileResult.body);
      return promiseRequest('put', {
        url: endpoint + 'api/ImageCollections/' + fileResult.id + '?access_token=' + accessToken,
        json: true,
        body: {
          groupCoverImageCollectionId: createResult.body.id
        }
      }).then((updatedFileResult) => {
        createResult.body.file = updatedFileResult.body;
        return Promise.resolve(createResult);
      });
    });
  });
}

/**
 * Function to update a group.
 * @param endpoint {string}
 * @param groupId {int}
 * @param name {string}
 * @param description {string}
 * @param colour {string}
 * @param coverImage {file}
 * @param uid {int}
 * @param accessToken {string}
 * @param isModerator {boolean}
 */
function updateGroup(endpoint, {groupId, name, description, colour, coverImage, uid, accessToken, isModerator}) {
  if (!accessToken) {
    return Promise.reject('Please provide an access token!');
  }

  return promiseRequest('get', {
    url: `${endpoint}api/Groups/${groupId}?access_token=${accessToken}`,
    json: true
  }).then((groupGetResponse) => {
    const group = groupGetResponse.body;
    if (!isModerator && group.groupownerid !== uid) {
      return Promise.reject('User does not own the group!');
    }

    let promises = [];

    promises.push(promiseRequest('put', {
      url: `${endpoint}api/Groups/${groupId}?access_token=${accessToken}`,
      json: true,
      body: {
        name,
        description,
        colour
      }
    }));

    if (coverImage) {
      let fileExtension = coverImage.originalname.split('.');
      fileExtension = fileExtension[fileExtension.length - 1];
      const fileName = uuid.v4().replace('-', '') + '.' + fileExtension;

      promises.push(promiseRequest('post', {
        url: endpoint + 'api/ImageCollections/upload?access_token=' + accessToken + '&container=uxdev-biblo-imagebucket',
        formData: {
          file: {
            value: coverImage.buffer,
            options: {
              contentType: coverImage.mimetype,
              filename: fileName
            }
          }
        }
      }));
    }

    return Promise.all(promises).then((promiseResponses) => {
      let createResult = promiseResponses[0];

      if (promiseResponses[1]) {
        let fileResult = JSON.parse(promiseResponses[1].body);
        return promiseRequest('put', {
          url: endpoint + 'api/ImageCollections/' + fileResult.id + '?access_token=' + accessToken,
          json: true,
          body: {
            groupCoverImageCollectionId: createResult.body.id
          }
        }).then((updatedFileResult) => {
          createResult.body.file = updatedFileResult.body;
          return Promise.resolve(createResult.body);
        });
      }

      return Promise.resolve(createResult.body);
    });
  });
}

/**
 * Fetches a Group in Loopback
 */
function getGroup(endpoint, params) {
  return new Promise((resolve) => {
    const id = params.id;
    const filter_str = JSON.stringify(params.filter || {});
    const url = endpoint + 'api/Groups/' + id + '?filter=' + filter_str;
    request.get(
      {
        url: url
      },
      (err, httpResponse) => {
        resolve(httpResponse);
      }
    );
  });
}

/**
 * Fetches a posts for a group in Loopback
 */
function getPosts(endpoint, params) {
  return new Promise((resolve) => {
    const filter_str = JSON.stringify(params.filter || {});
    const url = endpoint + 'api/Posts/?filter=' + filter_str;
    request.get(
      {
        url: url
      },
      (err, httpResponse) => {
        resolve(httpResponse);
      }
    );
  });
}

/**
 * Fetches a comments for a post in Loopback
 */
function getComments(endpoint, params) {
  return new Promise((resolve) => {
    const filter_str = JSON.stringify(params.filter || {});
    const url = `${endpoint}api/Comments/?filter=${filter_str}`;
    request.get(
      {
        url: url
      },
      (err, httpResponse) => {
        resolve(httpResponse);
      }
    );
  });
}

/**
 * Get all comments (not necessarily related to a specific post).
 */
function getAllComments(endpoint, params) {
  const filter = JSON.stringify(params.filter || {});
  return promiseRequest('get', {
    url: `${endpoint}api/Comments/?filter=${filter}`
  });
}

/**
 * Queriess through Groups in Loopback
 */
function queryGroups(endpoint, params) {
  return new Promise((resolve, reject) => {
    const accessToken = params.accessToken;
    var pattern = new RegExp('.*' + params.query + '.*', 'i');
    const filter_str = JSON.stringify({where: {name: {regexp: pattern.toString()}}, include: ['members']});
    const url = endpoint + 'api/Groups?access_token=' + accessToken + '&filter=' + filter_str;
    request.get({url}, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
}

/**
 * Searches through Groups in Loopback (via a elasticsearch mixin)
 */
function searchGroups(endpoint, params) {
  return new Promise((resolve, reject) => {
    const accessToken = params.accessToken;
    const fields = JSON.stringify(params.fields);
    const q = encodeURIComponent(params.q);
    const url = endpoint + 'api/Groups/search?access_token=' + accessToken + '&q=' + q + '&fields=' + fields + '&limit=' + params.limit + '&from=' + params.from;
    request.get({url}, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
}


/**
 * Create a Post on a Group
 *
 * @param {string} endpoint
 * @param {Object} params
 */
function createPost(endpoint, params) {
  return new Promise((resolve, reject) => {
    const accessToken = params.accessToken;
    const groupId = params.parentId;
    const url = endpoint + 'api/Posts?access_token=' + accessToken;
    let postBody = {
      title: params.title,
      content: params.content,
      timeCreated: params.timeCreated,
      postownerid: params.ownerid,
      postcontainergroupid: groupId,
      groupid: groupId,
      attachedReviewId: params.attachedReviewId,
      id: params.id || null
    };

    if (params.video) {
      postBody.mimetype = params.video.mimetype || null;
      postBody.videofile = params.video.videofile || null;
      postBody.container = params.video.container || null;
    }

    if (params.pdf) {
      postBody.pdffile = params.pdf.pdffile;
      postBody.pdfContainer = params.pdf.container;
      postBody.pdfmimetype = 'application/pdf';
    }

    request.put({
      url,
      json: true,
      body: postBody
    }, (err, res) => {
      if (err) {
        reject(err);
      }

      resolve(res);
    });
  });
}

/**
 * Create a Comment on a Post
 */
function createComment(endpoint, params) {
  return new Promise((resolve, reject) => {
    const accessToken = params.accessToken;
    const postId = params.parentId;
    const url = endpoint + 'api/Comments?access_token=' + accessToken;
    const postBody = {
      title: params.title,
      content: params.content,
      timeCreated: params.timeCreated,
      attachedReviewId: params.attachedReviewId,
      commentownerid: params.ownerid,
      commentcontainerpostid: postId,
      postid: postId,
      id: params.id || null
    };

    if (params.video) {
      postBody.mimetype = params.video.mimetype || null;
      postBody.videofile = params.video.videofile || null;
      postBody.container = params.video.container || null;
    }

    request.put({
      url,
      json: true,
      body: postBody
    }, (err, res) => {
      if (err) {
        reject(err);
      }

      resolve(res);
    });
  });
}

/**
 * Marks a comment as deleted in the CS.
 * @param endpoint
 * @param id
 */
function deleteComment(endpoint, {id}) {
  request.put({
    url: `${endpoint}api/Comments`,
    json: true,
    body: {
      id: id,
      timeDeleted: Date.now()
    }
  });
}

function countComments(endpoint, {accessToken, where}) {
  return promiseRequest('get', `${endpoint}api/Comments/count?access_token=${accessToken}${where ? `&where=${JSON.stringify(where)}` : ''}`);
}

function countPosts(endpoint, {accessToken, where}) {
  return promiseRequest('get', `${endpoint}api/Posts/count?access_token=${accessToken}${where ? `&where=${JSON.stringify(where)}` : ''}`);
}

function countGroups(endpoint, {accessToken, where}) {
  return promiseRequest('get', `${endpoint}api/Groups/count?access_token=${accessToken}${where ? `&where=${JSON.stringify(where)}` : ''}`);
}

function countReviews(endpoint, {accessToken, where}) {
  return promiseRequest('get', `${endpoint}api/reviews/count?access_token=${accessToken}${where ? `&where=${JSON.stringify(where)}` : ''}`);
}

/**
 * Flag a Post
 */
function flagPost(endpoint, params) {
  return new Promise((resolve, reject) => {

    const accessToken = params.accessToken;
    const postId = params.postId;
    const ownerId = params.flagger;
    const description = params.description;

    // Create flag
    const url = endpoint + 'api/Flags?access_token=' + accessToken;
    const flagPostBody = {
      timeFlagged: Date.now(),
      description,
      markedAsRead: false,
      ownerId,
      postFlagsId: postId
    };

    // create flag
    request.post({
      url,
      json: true,
      body: flagPostBody
    }, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
}

/**
 * Flag a Comment
 */
function flagComment(endpoint, params) {
  return new Promise((resolve, reject) => {

    const accessToken = params.accessToken;
    const commentId = params.commentId;
    const ownerId = params.flagger;
    const description = params.description;

    // Create flag
    const url = endpoint + 'api/Flags?access_token=' + accessToken;
    const flagCommentBody = {
      timeFlagged: Date.now(),
      description,
      markedAsRead: false,
      ownerId,
      commentFlagsId: commentId
    };

    // create flag
    request.post({
      url,
      json: true,
      body: flagCommentBody
    }, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
}

/**
 * Flag a Group
 */
function flagGroup(endpoint, params) {
  return new Promise((resolve, reject) => {

    const accessToken = params.accessToken;
    const groupId = params.groupId;
    const ownerId = params.flagger;
    const description = params.description;

    // Create flag
    const url = endpoint + 'api/Flags?access_token=' + accessToken;
    const flagGroupBody = {
      timeFlagged: Date.now(),
      description,
      markedAsRead: false,
      ownerId,
      groupFlagsId: groupId
    };

    // create flag
    request.post({
      url,
      json: true,
      body: flagGroupBody
    }, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
}

/**
 * Flag a Review
 */
function flagReview(endpoint, params) {
  return new Promise((resolve, reject) => {

    const accessToken = params.accessToken;
    const reviewId = params.reviewId;
    const ownerId = params.flagger;
    const description = params.description;

    // Create flag
    const url = endpoint + 'api/Flags?access_token=' + accessToken;
    const reviewGroupBody = {
      timeFlagged: Date.now(),
      description,
      markedAsRead: false,
      ownerId,
      reviewFlagsId: reviewId
    };

    // create flag
    request.post({
      url,
      json: true,
      body: reviewGroupBody
    }, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
}

/**
 * Like a post
 */
function likePost(endpoint, params) {
  return new Promise((resolve, reject) => {

    const accessToken = params.accessToken;
    const profileId = params.profileId;
    const postId = params.postId;
    const value = '1'; //  like=1, dislike=-1

    const url = endpoint + 'api/Posts/' + postId + '/likes?access_token=' + accessToken;
    const likePostBody = {
      value,
      profileId,
      likeid: postId
    };

    const requestParams = {
      url,
      json: true,
      body: likePostBody
    };

    // create like
    request.post(requestParams, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
}

/**
 * Like a review
 */
function likeReview(endpoint, params) {
  return new Promise((resolve, reject) => {

    const accessToken = params.accessToken;
    const profileId = params.profileId;
    const reviewId = params.reviewId;
    const value = '1'; //  like=1, dislike=-1

    const url = endpoint + 'api/reviews/' + reviewId + '/likes?access_token=' + accessToken;
    const likePostBody = {
      value,
      profileId
    };

    const requestParams = {
      url,
      json: true,
      body: likePostBody
    };

    // create like
    request.post(requestParams, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
}


/**
 * unlike a post
 */
function unlikePost(endpoint, params) {
  return new Promise((resolve, reject) => {

    const accessToken = params.accessToken;
    const profileId = params.profileId;
    const postId = params.postId;
    const value = '1'; //  like=1, dislike=-1

    const url = endpoint + 'api/Posts/' + postId + '/likes?access_token=' + accessToken;
    const likePostBody = {
      value,
      profileId
    };

    const requestParams = {
      url,
      json: true,
      body: likePostBody
    };

    // create like
    request.del(requestParams, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
}

/**
 * unlike a review
 */
function unlikeReview(endpoint, params) {
  return new Promise((resolve, reject) => {

    const accessToken = params.accessToken;
    const profileId = params.profileId;
    const reviewId = params.reviewId;
    const value = '1'; //  like=1, dislike=-1

    const url = endpoint + 'api/reviews/' + reviewId + '/likes?access_token=' + accessToken;
    const likeReviewBody = {
      value,
      profileId
    };

    const requestParams = {
      url,
      json: true,
      body: likeReviewBody
    };

    // create like
    request.del(requestParams, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
}


function checkIfProfileIsQuarantined(endpoint, id) {
  return promiseRequest('get', {url: `${endpoint}api/Quarantines/${id}/check-if-profile-is-quarantined`});
}

/**
 * Delete Group
 *
 * @param endpoint
 * @param params
 * @returns {Promise}
 */
function deleteGroup(endpoint, {id, accessToken}) {
  return promiseRequest('delete', {url: `${endpoint}api/Groups/${id}?access_token=${accessToken}`});
}

/**
 * Close Group
 *
 * @param endpoint
 * @param params
 * @returns {Promise}
 */
function closeGroup(endpoint, {id, timeClosed, accessToken}) {
  return promiseRequest('put', {
    url: `${endpoint}api/Groups/${id}?access_token=${accessToken}`,
    body: {timeClosed},
    json: true
  });
}

/**
 * Mark a post as deleted
 */
function markPostAsDeleted(endpoint, params) {
  return new Promise((resolve, reject) => {

    const accessToken = params.accessToken;
    const postId = params.id;

    const url = endpoint + 'api/Posts/' + postId + '?access_token=' + accessToken;

    const deletePostBody = {
      markedAsDeleted: true
    };

    const requestParams = {
      url,
      json: true,
      body: deletePostBody
    };

    // create like
    request.put(requestParams, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
}

/**
 * Mark a reviewt as deleted
 */
function markReviewAsDeleted(endpoint, params) {
  return new Promise((resolve, reject) => {

    const accessToken = params.accessToken;
    const reviewId = params.id;

    const url = endpoint + 'api/reviews/' + reviewId + '?access_token=' + accessToken;

    const deletePostBody = {
      markedAsDeleted: true
    };

    const requestParams = {
      url,
      json: true,
      body: deletePostBody
    };

    // create like
    request.put(requestParams, (err, res) => {
      if (err) {
        reject(err);
      }
      resolve(res);
    });
  });
}


function getReviews(endpoint, params) {
  return promiseRequest('get', {
    url: `${endpoint}api/reviews/?filter=${JSON.stringify(params.filter || [])}`,
    json: true
  });
}

function createReview(endpoint, params) {
  return new Promise((resolve, reject) => {
    const url = endpoint + 'api/reviews?';
    const postBody = {
      id: params.id || null,
      pid: params.pid,
      libraryid: params.libraryid,
      content: params.content,
      created: params.created,
      modified: params.modified,
      worktype: params.worktype,
      reviewownerid: params.reviewownerid,
      rating: params.rating,
      image: params.image
    };

    if (params.video) {
      postBody.mimetype = params.video.mimetype || null;
      postBody.videofile = params.video.videofile || null;
      postBody.container = params.video.container || null;
    }

    if (params.id) {
      request.put({
        url,
        json: true,
        body: postBody
      }, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    }
    else {
      request.post({
        url,
        json: true,
        body: postBody
      }, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    }
  });
}

function checkForMemberInGroup(endpoint, {groupId, profileId}) {
  return promiseRequest('get', {
    url: `${endpoint}api/Groups/${groupId}/members/${profileId}`
  });
}

function getUserQuarantines(endpoint, {uid, filter}) {
  filter = encodeURIComponent(JSON.stringify(filter || {}));

  return promiseRequest('get', {
    url: `${endpoint}api/Profiles/${uid}/quarantines?filter=${filter}`
  });
}

/**
 * This function creates a listener on quarantines
 * @param {String} endpoint
 * @param {Object} logger
 * @param {Function || Array} callback
 * @returns {Promise}
 */
function listenForNewQuarantines(endpoint, logger, callback) {
  if (!callback || (typeof callback !== 'function' && !Array.isArray(callback))) {
    return Promise.reject('Callback needs to be a function!');
  }

  return changeStreamListener(endpoint, 'Quarantines', callback, logger);
}

/**
 * This function creates a change stream listener on posts
 * @param {String}endpoint
 * @param {Object} logger
 * @param {Function || Array} callback
 * @returns {Promise}
 */
function listenForNewPosts(endpoint, logger, callback) {
  if (!callback || (typeof callback !== 'function' && !Array.isArray(callback))) {
    return Promise.reject('Callback needs to be a function!');
  }

  return changeStreamListener(endpoint, 'Posts', callback, logger);
}

/**
 * This function creates a change stream listener on posts
 * @param {String}endpoint
 * @param {Object} logger
 * @param {Function || Array} callback
 * @returns {Promise}
 */
function listenForNewComments(endpoint, logger, callback) {
  if (!callback || (typeof callback !== 'function' && !Array.isArray(callback))) {
    return Promise.reject('Callback needs to be a function!');
  }

  return changeStreamListener(endpoint, 'Comments', callback, logger);
}

/**
 * This method calls the community service suggester on groups.
 * @param {String}endpoint
 * @param {Object}logger
 * @param {Object}params
 * @returns {Promise}
 */
function groupSuggest(endpoint, logger, params) {
  return promiseRequest('get', {
    url: `${endpoint}api/Groups/suggest?q=${encodeURIComponent(params.q)}`
  });
}

/**
 * Checks if a group name is taken.
 * @param {URL}endpoint
 * @param {Object}params
 * @returns {Promise}
 */
function checkIfGroupNameExists(endpoint, params) {
  // where[name][regexp]=/^${params.groupName}$/i
  const queryString = `where%5Bname%5D%5Bregexp%5D=%2F%5E${encodeURIComponent(params.groupName)}%24%2Fi`;

  return promiseRequest('get', {
    url: `${endpoint}api/Groups/count?${queryString}`
  });
}

/**
 * This function get the top works based on reviews.
 * @param endpoint
 * @param logger
 * @param params
 * @returns {Promise}
 */
function topWorksFromReviews(endpoint, params) {
  // First we extract our arguments from params.
  const offset = params.offset || 0;
  const size = params.size || 50;
  const age = params.age || 365;
  const ratingParameter = params.ratingParameter || 1;
  const countsParameter = params.countsParameter || 1;
  const worktypes = params.worktypes || [];
  const shouldFilter = !!worktypes.length;

  // Now we construct an aggregation that assigns a score to works based on reviews.
  const popAggregation = {
    range: {
      date_range: {
        field: 'created',
        format: 'MM-yyy',
        ranges: [
          {from: `now-${age}d`}
        ]
      },
      aggs: {
        pids: {
          terms: {field: 'pid.raw', size: size * 2}, // The works are sorted manually, so we need at least twice as many to provide a decent image.
          aggs: {
            avg_rate: {avg: {field: 'rating'}},
            pid_score: {
              bucket_script: {
                buckets_path: {avg_rate: 'avg_rate', pids: '_count'},
                script: {
                  inline: `(log10(pids) * ${countsParameter}) * (avg_rate * ${ratingParameter})`,
                  lang: 'expression'
                }
              }
            }
          }
        }
      }
    }
  };

  // And we construct a query to send to the community service.
  const query = JSON.stringify({
    from: offset,
    size,
    // If we want to filter based on worktypes, we need a different query.
    aggs: shouldFilter ? {
      worktypes: {
        filters: {
          filters: worktypes.map(wType => ({
            term: { //
              worktype: wType
            }
          }))
        },
        aggs: popAggregation
      }
    } : popAggregation
  });

  return promiseRequest('get', {
    url: `${endpoint}api/Reviews/search?limit=1&q=${query}`
  });
}

/**
 * Get campaign by id.
 * @param {String} endpoint
 * @param {number} id
 * @returns {Promise}
 */
function getCampaign(endpoint, {id, filter}) {
  filter = encodeURIComponent(
    JSON.stringify(
      Object.assign({
        include: {group: 'coverImage'}
      }, filter)
    )
  );

  return promiseRequest('get', {
    url: `${endpoint}api/Campaigns/${id}?filter=${filter}`,
    json: true
  });
}

/**
 * Generic get campaign
 * @param {String} endpoint
 * @param {String} type
 * @param {mixed} include
 * @returns {Promise}
 */
function getCampaigns(endpoint, type, include = []) {
  const filter = {
    where: {
      type
    },
    include
  };

  const filterString = encodeURIComponent(JSON.stringify(filter));
  return promiseRequest('get', {
    url: `${endpoint}api/Campaigns?filter=${filterString}`,
    json: true
  });
}

/**
 * Gets review campaigns
 * @param {String} endpoint
 * @returns {Promise}
 */
function getReviewCampaigns(endpoint) {
  return getCampaigns(endpoint, 'review').then(campaignsResponse => {
    const campaigns = campaignsResponse.body.map(campaign => {
      campaign.workTypes = campaign.workTypes.map(type => type.worktype);
      return campaign;
    });

    return campaigns;
  });
}

/**
 * Gets group campaigns
 * @param {String} endpoint
 * @returns {Promise}
 */
function getGroupCampaigns(endpoint) {
  return getCampaigns(endpoint, 'group', 'group');
}

/**
 * Gets the members of a group
 * @param {String} endpoint
 * @param {number} id
 * @returns {Promise}
 */
function getGroupMembers(endpoint, {id, filter = {}}) {
  filter = encodeURIComponent(JSON.stringify(filter));
  return promiseRequest('get', {
    url: `${endpoint}api/Groups/${id}/members?filter=${filter}`,
    json: true
  }).then(res => res.body);
}

/**
 * Gets a users groups.
 * @param {string} endpoint
 * @param {number}uid
 * @param {mixed} include
 * @returns {Promise}
 */
function getMyGroups(endpoint, {uid, include = 'group'}) {
  const filter = encodeURIComponent(JSON.stringify({
    where: {
      profileid: uid
    },
    include
  }));

  return promiseRequest('get', {
    url: `${endpoint}api/GroupProfiles?filter=${filter}`,
    json: true
  }).then(res => res.body);
}

function getPostPdf(endpoint, {id}) {
  const filter = encodeURIComponent(JSON.stringify({
    include: 'pdf'
  }));

  return promiseRequest('get', {
    url: `${endpoint}api/posts/${id}?filter=${filter}`,
    json: true
  });
}

/**
 * Remove pdf from post
 * @param {string} endpoint
 * @param {number} pdfId
 */
function removePdf(endpoint, {pdfId}) {
  return promiseRequest('del', {
    url: `${endpoint}api/files/${pdfId}`,
    json: true
  });
}

/**
 * Setting the necessary paramerters for the client to be usable.
 * The endpoint is only set if endpoint is null to allow setting it through
 * environment variables.
 *
 * @param {Object} config Config object with the necessary parameters to use
 * the webservice
 */
module.exports = function CommunityClient(logger, config = null) {

  if (!config || !config.endpoint) {
    throw new Error('Expected config object but got null or no endpoint provided');
  }

  return {
    listenForNewQuarantines: listenForNewQuarantines.bind(null, config.endpoint, logger),
    listenForNewPosts: listenForNewPosts.bind(null, config.endpoint, logger),
    listenForNewComments: listenForNewComments.bind(null, config.endpoint, logger),
    topWorksFromReviews: topWorksFromReviews.bind(null, config.endpoint),
    checkIfUserProfileExists: checkIfUserProfileExists.bind(null, config.endpoint),
    checkIfDisplayNameIsTaken: checkIfDisplayNameIsTaken.bind(null, config.endpoint),
    checkIfGroupNameExists: checkIfGroupNameExists.bind(null, config.endpoint),
    checkIfProfileIsQuarantined: checkIfProfileIsQuarantined.bind(null, config.endpoint),
    loginAndGetProfile: loginAndGetProfile.bind(null, config.endpoint),
    createProfile: createProfile.bind(null, config.endpoint),
    updateProfile: updateProfile.bind(null, config.endpoint),
    updateImage: updateImage.bind(null, config.endpoint),
    updateImageCollection: updateImageCollection.bind(null, config.endpoint),
    uploadImage: uploadImage.bind(null, config.endpoint),
    removeImage: removeImage.bind(null, config.endpoint),
    getFullProfile: getFullProfile.bind(null, config.endpoint),
    getImage: getImage.bind(null, config.endpoint),
    getResizedImage: getResizedImage.bind(null, config.endpoint),
    joinGroup: joinGroup.bind(null, config.endpoint),
    leaveGroup: leaveGroup.bind(null, config.endpoint),
    getGroup: getGroup.bind(null, config.endpoint),
    closeGroup: closeGroup.bind(null, config.endpoint),
    deleteGroup: deleteGroup.bind(null, config.endpoint),
    listGroups: listGroups.bind(null, config.endpoint),
    getPosts: getPosts.bind(null, config.endpoint),
    getComments: getComments.bind(null, config.endpoint),
    getAllComments: getAllComments.bind(null, config.endpoint),
    queryGroups: queryGroups.bind(null, config.endpoint),
    searchGroups: searchGroups.bind(null, config.endpoint),
    flagPost: flagPost.bind(null, config.endpoint),
    flagComment: flagComment.bind(null, config.endpoint),
    flagGroup: flagGroup.bind(null, config.endpoint),
    flagReview: flagReview.bind(null, config.endpoint),
    createPost: createPost.bind(null, config.endpoint),
    createComment: createComment.bind(null, config.endpoint),
    deleteComment: deleteComment.bind(null, config.endpoint),
    createGroup: createGroup.bind(null, config.endpoint),
    updateGroup: updateGroup.bind(null, config.endpoint),
    countComments: countComments.bind(null, config.endpoint),
    countGroups: countGroups.bind(null, config.endpoint),
    countPosts: countPosts.bind(null, config.endpoint),
    countReviews: countReviews.bind(null, config.endpoint),
    likePost: likePost.bind(null, config.endpoint),
    likeReview: likeReview.bind(null, config.endpoint),
    unlikePost: unlikePost.bind(null, config.endpoint),
    unlikeReview: unlikeReview.bind(null, config.endpoint),
    markPostAsDeleted: markPostAsDeleted.bind(null, config.endpoint),
    markReviewAsDeleted: markReviewAsDeleted.bind(null, config.endpoint),
    getReviews: getReviews.bind(null, config.endpoint),
    checkForMemberInGroup: checkForMemberInGroup.bind(null, config.endpoint),
    getUserQuarantines: getUserQuarantines.bind(null, config.endpoint),
    createReview: createReview.bind(null, config.endpoint),
    groupSuggest: groupSuggest.bind(null, config.endpoint, logger),
    getReviewCampaigns: getReviewCampaigns.bind(null, config.endpoint),
    getGroupCampaigns: getGroupCampaigns.bind(null, config.endpoint),
    getCampaign: getCampaign.bind(null, config.endpoint),
    getGroupMembers: getGroupMembers.bind(null, config.endpoint),
    getMyGroups: getMyGroups.bind(null, config.endpoint),
    getPostPdf: getPostPdf.bind(null, config.endpoint),
    removePdf: removePdf.bind(null, config.endpoint)
  };
};
