'use strict';

import {profileMock, moderatorMock} from './profile.mock';

export const emptyFeedMock = {
  feed: [],
  count: {comments: 0, commentsTotal: 0, posts: 0, postsTotal: 0},
  profile: profileMock
};

export const feedMock = {
  feed: [{
    html: 'Dette er en totalt nice kommentar, den er faktisk så nice!',
    timeCreated: '2016-03-10T11:42:26.000Z',
    id: 46,
    commentownerid: 109,
    commentcontainerpostid: 42,
    postid: 42,
    post: {
      title: ' ',
      html: 'Dette er det vildeste indlæg, totalt vildt mand!',
      timeCreated: '2016-03-10T11:42:21.000Z',
      id: 42,
      postownerid: 109,
      postcontainergroupid: 10,
      postid: null,
      groupid: 10,
      group: {
        name: 'pusheen',
        description: 'gruppen for pusheen entusiaster!',
        colour: 'blue',
        timeCreated: '2016-03-10T09:02:57.000Z',
        id: 10,
        groupownerid: 86,
        coverImage: {
          id: 40,
          profileImageCollection: null,
          groupCoverImageCollectionId: 10,
          postImageCollection: null,
          commentImageCollection: null
        }
      }
    },
    type: 'comment',
    imageSrc: '/billede/40/small',
    owner: profileMock
  }, {
    title: ' ',
    html: 'Dette er et mindre opslag...',
    timeCreated: '2016-03-10T11:42:21.000Z',
    id: 43,
    postownerid: 109,
    postcontainergroupid: 10,
    postid: null,
    groupid: 10,
    group: {
      name: 'pusheen',
      description: 'gruppen for pusheen entusiaster!',
      colour: 'blue',
      timeCreated: '2016-03-10T09:02:57.000Z',
      id: 10,
      groupownerid: 86,
      coverImage: {
        id: 40,
        profileImageCollection: null,
        groupCoverImageCollectionId: 10,
        postImageCollection: null,
        commentImageCollection: null
      }
    },
    type: 'post',
    imageSrc: '/billede/40/small'
  }],
  count: {comments: 1, commentsTotal: 1, posts: 1, postsTotal: 1},
  profile: profileMock
};

/**
 * Mock of the feed object with a moderator as the viewer.
 * @type {{}}
 */
export const moderatedFeedMock = Object.assign({}, feedMock, {
  profile: moderatorMock
});
