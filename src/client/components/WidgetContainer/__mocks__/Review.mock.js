/**
 * @file: This file contains mock of review, created for tests.
 */

export const singleReviewMock = {
  pid: '870970-basis:51087771',
  libraryid: '718500',
  worktype: 'book',
  content: 'bob',
  html: 'bob',
  created: '2016-05-09T11:10:20.000Z',
  modified: '2016-05-09T11:10:20.000Z',
  rating: 6,
  markedAsDeleted: null,
  palleid: null,
  id: 291550,
  reviewownerid: 10,
  likes: [],
  owner: {
    raw: {description: 'test', displayName: 'Jacob'},
    description: 'test',
    displayName: 'Jacob',
    id: 10,
    groups: [],
    image: '/billede/103/small',
    isModerator: false
  },
  image: null
};

export const singleCampaignReviewMock = {
  pid: '870970-basis:06903177',
  libraryid: '100451',
  worktype: 'book',
  content: 'asdf',
  created: '2016-06-13T13:43:32.000Z',
  modified: '2016-06-13T13:43:32.000Z',
  rating: 5,
  markedAsDeleted: null,
  palleid: null,
  id: 39,
  reviewownerid: 323,
  likes: [],
  video: {
    id: 98,
    postVideoCollection: null,
    commentVideoCollection: null,
    reviewVideoCollection: 39,
    resolutions: [{
      size: 'original_video',
      id: 2685,
      videoCollectionResolutionId: 98,
      imageCollectionResolutionId: null,
      video: {
        container: 'uxdev-biblo-input-videobucket',
        name: '1465825408820_profile_323.mp4',
        type: 'video/mp4',
        url: 'api/fileContainers/uxdev-biblo-input-videobucket/download/1465825408820_profile_323.mp4',
        id: 2696,
        resolutionImageFileId: null,
        resolutionVideoFileId: 2685
      }
    }, {
      size: '854x480',
      id: 2686,
      videoCollectionResolutionId: 98,
      imageCollectionResolutionId: null,
      video: {
        container: 'uxdev-biblo-output-videobucket',
        name: '1465825408820_profile_323.mp4',
        type: 'video/mp4',
        url: 'api/fileContainers/uxdev-biblo-output-videobucket/download/1465825408820_profile_323.mp4',
        id: 2697,
        resolutionImageFileId: null,
        resolutionVideoFileId: 2686
      }
    }]
  },
  owner: {
    raw: {
      description: 'afasda',
      displayName: 'jonas'
    },
    description: '“afasda”',
    displayName: 'jonas',
    id: 323,
    groups: [],
    image: '/billede/326/small',
    isModerator: false
  },
  campaign: {
    campaignName: 'Sommerbogen 2016',
    startDate: '2016-06-09T20:00:00.044Z',
    endDate: '2016-08-21T04:00:00.044Z',
    logos: {
      svg: '/sommerbogen-logo.svg',
      small: '/sommerbogen-logo.png',
      medium: '/sommerbogen-logo.png',
      large: '/sommerbogen-logo.png'
    },
    type: 'review',
    id: 1,
    workTypes: ['book', 'audiobook', 'literature']
  },
  image: null,
  html: 'asdf'
};
