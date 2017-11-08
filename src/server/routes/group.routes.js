/**
 * @file
 * Configure group routes
 */

import express from 'express';
import multer from 'multer';
import sanitize from 'sanitize-html';
import {createElasticTranscoderJob} from './../utils/aws.util.js';

import {groupCreateForm} from '../forms/group.forms';

import {ensureUserHasProfile, ensureAuthenticated} from '../middlewares/auth.middleware';

const upload = multer({storage: multer.memoryStorage()});
const GroupRoutes = express.Router();

// React components
import GroupContainer from '../../client/components/Groups/GroupsContainer.component';

GroupRoutes.get('/opret', ensureAuthenticated, ensureUserHasProfile, (req, res) => {
  let data = {};
  let windowData = {
    propertyName: 'DATA',
    data: JSON.stringify(data).replace('\'', '\\\'')
  };

  res.locals.title = 'Opret gruppe - Biblo.dk';

  res.render('page', {
    css: ['/css/groupcreate.css'],
    js: ['/js/groupcreate.js'],
    data: [windowData]
  });
});

GroupRoutes.post('/opret', ensureAuthenticated, ensureUserHasProfile, upload.single('group_image'), async function (req, res) {
  const data = {
    status: 'INCOMPLETE'
  };
  const errors = [];

  function handler(form) {
    for (let key in form.fields) {
      if (form.fields.hasOwnProperty(key)) {
        if (form.fields[key].error) {
          errors.push({
            errorMessage: form.fields[key].error,
            field: key
          });
        }
      }
    }
  }

  groupCreateForm.handle(req, {
    error: handler,
    empty: handler,
    other: handler
  });

  if (!req.file) {
    errors.push({
      errorMessage: 'Husk at vælge et coverbillede!',
      field: 'group_image'
    });
  }

  // We want to ensure new groups have a unique name.
  if (req.body['group-name']) {
    const nameCheck = (await req.callServiceProvider('checkIfGroupNameExists', {groupName: req.body['group-name']}))[0];
    if (nameCheck.errors.length > 0 || nameCheck.statusCode >= 400) {
      errors.push({
        errorMessage: 'Der er sket en fejl, prøv igen senere!',
        field: 'group_image'
      });
    }
    else if (nameCheck.exists) {
      errors.push({
        errorMessage: 'Der findes allerede en gruppe med det navn',
        field: 'group-name'
      });
    }
  }

  if (errors.length > 0) {
    data.status = 'ERROR';
    data.errors = errors;
  }
  else {
    // request is valid
    let createRes = (await req.callServiceProvider('createGroup', {
      name: req.body['group-name'],
      description: req.body['group-description'],
      colour: 'blue',
      group_image: req.file
    }))[0];

    if (createRes.status === 200) {
      data.status = 'OK';
      data.redirect = '/grupper/' + createRes.data.id;
      data.group = createRes.data;
    }
    else if (createRes.errors && createRes.errors.length > 0) {
      data.status = 'ERROR';
      data.errors = errors.concat(createRes.errors);
    }
    else {
      errors.push({
        field: 'general',
        errorMessage: 'Der skete en fejl ved gruppe oprettelse, prøv igen senere!'
      });
      data.status = 'ERROR';
      data.errors = errors;
    }
  }

  if (req.xhr) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data));
  }
  else {
    let windowData = {
      propertyName: 'DATA',
      data: JSON.stringify(data).replace('\'', '\\\'')
    };

    res.render('page', {
      css: ['/css/groupcreate.css'],
      js: ['/js/groupcreate.js'],
      data: [windowData]
    });
  }
});

GroupRoutes.get('/post/:id', async function (req, res) {
  try {
    let idObj = (await req.callServiceProvider('getGroupId', {id: req.params.id, type: 'post'}))[0].body;
    res.redirect(`/grupper/${idObj.groupid}/${idObj.postid}`);
  }
  catch (e) {
    const logger = req.app.get('logger');
    logger.error('An error occured while retrieving a group', {error: e, params: req.params});
    res.redirect('/error/500');
  }
});

GroupRoutes.get('/kommentar/:id', async function (req, res) {
  try {
    let idObj = (await req.callServiceProvider('getGroupId', {id: req.params.id, type: 'comment'}))[0].body;
    res.redirect(`/grupper/${idObj.groupid}/${idObj.postid}/${req.params.id}#comment_${req.params.id}`);
  }
  catch (e) {
    const logger = req.app.get('logger');
    logger.error('An error occured while retrieving a comment', {error: e, params: req.params});
    res.redirect('/error/500');
  }
});

GroupRoutes.get('/:id/rediger', ensureAuthenticated, ensureUserHasProfile, async function editGroupRoute(req, res) {
  let data = {};
  data.groupData = (await req.callServiceProvider('getGroup', {id: req.params.id, allMembers: false}))[0];

  const p = req.session.passport.user.profile.profile;
  if (data.groupData.groupownerid !== p.id && !p.isModerator) {
    return res.redirect('/error/403');
  }

  if (data.groupData.markedAsDeleted) {
    return res.redirect(`/grupper/${req.params.id}`);
  }

  return res.render('page', {
    css: ['/css/groupedit.css'],
    js: ['/js/groupedit.js'],
    jsonData: [JSON.stringify(data)]
  });
});

GroupRoutes.post('/:id/rediger', ensureAuthenticated, ensureUserHasProfile, upload.single('group_image'), async function editGroupRoutePost(req, res) {
  let data = {
    status: 'INCOMPLETE'
  };
  let errors = [];
  data.groupData = (await req.callServiceProvider('getGroup', {id: req.params.id, allMembers: false}))[0];

  function handler(form) {
    for (let key in form.fields) {
      if (form.fields.hasOwnProperty(key)) {
        if (form.fields[key].error) {
          errors.push({
            errorMessage: form.fields[key].error,
            field: key
          });
        }
      }
    }
  }

  groupCreateForm.handle(req, {
    error: handler,
    empty: handler,
    other: handler
  });

  if (errors.length > 0) {
    data.errors = errors;
    data.status = 'ERROR';
  }
  else {
    // Handle serviceprovider;
    let updateQuery = {
      id: req.params.id,
      name: req.body['group-name'],
      description: req.body['group-description'],
      colour: 'blue'
    };

    if (req.file) {
      updateQuery.group_image = req.file;
    }

    try {
      let updateGroupResponse = (await req.callServiceProvider('updateGroup', updateQuery))[0];
      if (updateGroupResponse.errors && updateGroupResponse.errors.length > 0) {
        errors = updateGroupResponse.errors.concat(errors);
        data.status = 'ERROR';
        data.errors = errors;
      }
      else {
        data.status = 'OK';
        data.groupData = updateGroupResponse.data;
        data.redirect = '/grupper/' + req.params.id;
      }
    }
    catch (e) {
      if (typeof e === 'string') {
        errors.push({
          errorMessage: e,
          field: 'general'
        });
      }
      else {
        errors.push(e);
      }
      data.errors = errors;
      data.status = 'ERROR';
    }
  }

  if (req.xhr) {
    res.send(JSON.stringify(data));
    res.end();
  }
  else {
    res.render('page', {
      css: ['/css/groupedit.css'],
      js: ['/js/groupedit.js'],
      jsonData: [JSON.stringify(data)]
    });
  }
});

/**
 * Method for showing group
 *
 * @param groupData
 * @param res
 */
function showGroup(groupData, res) {
  res.locals.title = `${groupData.raw.name} - Biblo.dk`;
  res.render('page', {
    css: ['/css/groupdetail.css'],
    js: ['/js/groupdetail.js'],
    jsonData: [JSON.stringify({groupData})]
  });
}

/**
 * Get data for a group
 *
 * @param params
 * @param req
 * @param res
 * @param {Object} update
 */
async function fetchGroupData(params, req, res, update = {}) {
  try {
    let postsPromise;
    if (params.postid) {
      postsPromise = req.callServiceProvider('getSinglePosts', {
        id: params.postid,
        filter: {
          include: [
            'image',
            'pdf',
            'likes',
            {owner: ['image']},
            {comments: [{owner: ['image']}, 'image']},
            {
              relation: 'review',
              scope: {
                include: [
                  'image',
                  {
                    relation: 'video',
                    scope: {
                      include: [
                        {
                          relation: 'resolutions',
                          scope: {
                            include: ['video']
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            },
            {
              relation: 'video',
              scope: {
                include: [
                  {
                    relation: 'resolutions',
                    scope: {
                      include: ['video']
                    }
                  }
                ]
              }
            }
          ]
        }
      }).then((result) => {
        result[0].id = Math.abs(result[0].id);
        return Promise.resolve(result);
      });
    }
    else {
      postsPromise = req.callServiceProvider('getPosts', {id: params.id, skip: 0, limit: 5});
    }

    let reviewsPromise;
    let profile = {profile: {}};

    if (req.isAuthenticated()) {
      profile = req.session.passport.user.profile;
      const profileId = profile.profile.id;
      reviewsPromise = req.callServiceProvider('getOwnReview', {reviewownerid: profileId, offset: 0, order: 'created ASC', markedAsDeleted: null});

      const isMemberOfGroup = (await req.callServiceProvider('checkForMemberInGroup', {id: params.id}))[0];
      if (isMemberOfGroup) {
        // The user is a member of the group, so we want to refresh the last visited attribute on the membership.
        await req.callServiceProvider('joinGroup', {groupId: params.id, profileId});
      }
    }
    else {
      reviewsPromise = Promise.resolve([{data: [], errors: [], reviewsCount: 0}]);
    }

    console.time('a');
    let response = (await Promise.all([
      req.callServiceProvider('getGroup', params),
      postsPromise,
      reviewsPromise
    ]));
    console.timeEnd('a');

    profile.profile.reviews = response[2][0] || {data: [], reviewsCount: 0};
    res.locals.profile = JSON.stringify(profile);

    const group = response[0][0];
    // console.log(group);

    group.posts = Array.isArray(response[1][0]) ? response[1][0] : [response[1][0]];
    group.numberOfPostsLoaded = group.posts.length;
    showGroup(Object.assign(group, update), res);
  }
  catch (e) {
    const logger = req.app.get('logger');
    logger.error('An error occured while fetching groupdata', {error: e.message || e, params: params, session: req.session});
    res.locals.title = 'Fejl - Biblo.dk';
    res.redirect('/error');
  }
}

/**
 * Get group view
 */
GroupRoutes.get(['/:id', '/:id/:postid', '/:id/:postid/:commentid'], (req, res) => fetchGroupData(req.params, req, res));

/**
 * Add a post to a group
 */
GroupRoutes.post('/content/:type', ensureAuthenticated, upload.array(), async function (req, res) {
  const logger = req.app.get('logger');
  const ElasticTranscoder = req.app.get('ElasticTranscoder');
  const params = {
    title: ' ',
    content: sanitize(req.body.content, {allowedTags: []}) || ' ',
    parentId: req.body.parentId,
    type: req.params.type,
    imageId: req.body.imageId,
    id: req.body.id,
    imageRemoved: req.body.imageRemoved === 'true' || false,
    pdfRemoved: req.body.pdfRemoved === 'true',
    attachedReviewId: req.body.attachedReview === 'removed' ? null : req.body.attachedReview // this nulls the value in the db if "removed" is set.
  };

  if (req.session.videoupload) {
    params.video = req.session.videoupload;
  }

  if (req.session.pdfUploads && req.body.pdfRemoved !== 'true') {
    params.pdf = Object.assign({}, req.session.pdfUploads);
    req.session.pdfUploads = null;
  }

  const amazonConfig = req.config.get('ServiceProvider.aws');
  try {
    const response = (await req.callServiceProvider('createGroupContent', params, {request: req}))[0];

    // creating video conversion jobs at ElasticTranscoder
    if (req.session.videoupload && response && params) {
      if (params.type === 'post') {
        createElasticTranscoderJob(ElasticTranscoder, req.session.videoupload, response.id, null, null, logger, amazonConfig);
      }
      else {
        createElasticTranscoderJob(ElasticTranscoder, req.session.videoupload, null, response.id, null, logger, amazonConfig);
      }
    }

    req.session.videoupload = null;

    if (req.xhr) {
      let content;
      if (params.type === 'post') {
        content = (await req.callServiceProvider('getSinglePosts', {id: response.id}))[0];
      }
      else {
        content = (await req.callServiceProvider('getSingleComment', {id: response.id}))[0];
      }
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(content));
    }
    else if (!response) {
      logger.error('An error occured when creating a new post', {params: params});
      res.redirect('/error');
    }
    else {
      res.redirect(req.body.redirect);
    }
  }
  catch (e) {
    const errorObj = {
      message: e.message,
      name: e.name
    };
    if (errorObj.message === 'user is quarantined') {
      if (req.xhr) {
        let content = {
          errors: [{
            errorMessage: 'Du er i karantæne!',
            field: 'general'
          }]
        };
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(content));
      }
      else {
        res.redirect('/error/403?message=' + encodeURIComponent('Du er i karantæne!'));
      }
    }
    else {
      logger.error('An occured when creating a new post/comment', {params: params, error: errorObj});
      if (req.xhr) {
        res.sendStatus(400);
      }
      else {
        res.redirect('/error');
      }
    }
  }
});

GroupRoutes.get('/', async function getGroups(req, res, next) {
  try {
    const newGroups = (await req.callServiceProvider('listGroups', {}))[0];
    const popularGroups = (await req.callServiceProvider('listGroups', {order: 'group_pop DESC'}))[0];

    // Set groups to state and render the component
    req.writeToReduxStateTree('listGroupsReducer', {newGroups, popularGroups});
    req.renderComponent(GroupContainer);

    res.locals.title = 'Grupper - Biblo.dk';

    res.render('page', {
      css: ['/css/groups.css'],
      js: ['/js/groups.js']
    });
  }
  catch (e) {
    next(e);
  }
});

export default GroupRoutes;
