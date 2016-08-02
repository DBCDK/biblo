/**
 * @file: This file contains mocks for testing the editorially selected reviews widdget.
 */

/* eslint-disable max-len */

export const emptyState = {
  widgetConfig: {
    reviewIds: []
  },
  widgetReducerProp: {
    isLoading: false,
    reviews: {},
    works: {}
  }
};

export const singleReviewState = {
  widgetConfig: {
    reviewIds: [3]
  },
  widgetReducerProp: {
    isLoading: false,
    reviews: {
      3: {
        pid: '870970-basis:50536661',
        libraryid: '714700',
        worktype: 'book',
        content: 'Lorem Ipsum er ganske enkelt fyldtekst fra print- og typografiindustrien.',
        created: '2016-08-02T06:18:47.000Z',
        modified: '2016-08-02T06:18:47.000Z',
        rating: 5,
        markedAsDeleted: null,
        palleid: null,
        id: 3,
        reviewownerid: 323,
        likes: [],
        video: {
          id: 47,
          postVideoCollection: null,
          commentVideoCollection: null,
          reviewVideoCollection: 3,
          resolutions: [{
            size: 'original_video',
            id: 2372,
            videoCollectionResolutionId: 47,
            imageCollectionResolutionId: null,
            video: {
              container: 'uxdev-biblo-input-videobucket',
              name: '1463735516960_profile_323.mov',
              type: 'video/quicktime',
              url: 'api/fileContainers/uxdev-biblo-input-videobucket/download/1463735516960_profile_323.mov',
              id: 2383,
              resolutionImageFileId: null,
              resolutionVideoFileId: 2372
            }
          }]
        },
        owner: {
          raw: {description: 'afasda', displayName: 'Test Mesteren!'},
          description: '“afasda”',
          displayName: 'Test Mesteren!',
          id: 323,
          groups: [],
          postsInGroups: 0,
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
        html: 'Lorem Ipsum er ganske enkelt fyldtekst fra print- og typografiindustrien. Lorem Ipsum har været stan...'
      }
    },
    works: {
      '870970-basis:50536661': {
        collection: ['870970-basis:50536661', '870970-basis:51182200'],
        dcTitle: ['Harry Styles'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=50536661&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=53751215671ad7f5a422']
      }
    }
  }
};

export const fiveReviewsState = {
  widgetConfig: {
    reviewIds: [
      2,
      3,
      4,
      5,
      6
    ]
  },
  widgetReducerProp: {
    isLoading: false,
    reviews: {
      2: {
        pid: '870970-basis:50536661',
        libraryid: '757306',
        worktype: 'book',
        content: ' ',
        created: '2015-04-29T08:53:19.338Z',
        modified: '2016-04-29T08:53:19.338Z',
        rating: 3,
        markedAsDeleted: true,
        palleid: null,
        id: 2,
        reviewownerid: 6,
        likes: [],
        owner: {
          raw: {description: 'test', displayName: 'Test Mesteren!'},
          description: '“test”',
          displayName: 'Test Mesteren!',
          id: 6,
          groups: [],
          postsInGroups: 0,
          image: '/billede/393/small',
          isModerator: false
        },
        image: null,
        html: ' '
      },
      3: {
        pid: '870970-basis:50536661',
        libraryid: '714700',
        worktype: 'book',
        content: 'Lorem Ipsum er ganske enkelt fyldtekst fra print- og typografiindustrien.',
        created: '2016-08-02T06:18:47.000Z',
        modified: '2016-08-02T06:18:47.000Z',
        rating: 5,
        markedAsDeleted: null,
        palleid: null,
        id: 3,
        reviewownerid: 323,
        likes: [],
        video: {
          id: 47,
          postVideoCollection: null,
          commentVideoCollection: null,
          reviewVideoCollection: 3,
          resolutions: [{
            size: 'original_video',
            id: 2372,
            videoCollectionResolutionId: 47,
            imageCollectionResolutionId: null,
            video: {
              container: 'uxdev-biblo-input-videobucket',
              name: '1463735516960_profile_323.mov',
              type: 'video/quicktime',
              url: 'api/fileContainers/uxdev-biblo-input-videobucket/download/1463735516960_profile_323.mov',
              id: 2383,
              resolutionImageFileId: null,
              resolutionVideoFileId: 2372
            }
          }]
        },
        owner: {
          raw: {description: 'afasda', displayName: 'Test Mesteren!'},
          description: '“afasda”',
          displayName: 'Test Mesteren!',
          id: 323,
          groups: [],
          postsInGroups: 0,
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
        html: 'Lorem Ipsum er ganske enkelt fyldtekst fra print- og typografiindustrien. Lorem Ipsum har været stan...'
      },
      4: {
        pid: '870970-basis:22252852',
        libraryid: '716500',
        worktype: 'book',
        content: 'hep hep hep',
        created: '2016-05-26T10:21:07.000Z',
        modified: '2016-05-26T10:21:07.000Z',
        rating: 5,
        markedAsDeleted: null,
        palleid: null,
        id: 4,
        reviewownerid: 323,
        likes: [],
        image: '/billede/382/medium',
        owner: {
          raw: {description: 'afasda', displayName: 'Test Mesteren!'},
          description: '“afasda”',
          displayName: 'Test Mesteren!',
          id: 323,
          groups: [],
          postsInGroups: 0,
          image: '/billede/326/small',
          isModerator: false
        },
        imageId: 382,
        html: 'hep hep hep'
      },
      5: {
        pid: '870970-basis:22639862',
        libraryid: '716500',
        worktype: 'book',
        content: 'kopper',
        created: '2016-05-26T10:21:51.000Z',
        modified: '2016-05-26T10:21:51.000Z',
        rating: 3,
        markedAsDeleted: null,
        palleid: null,
        id: 5,
        reviewownerid: 323,
        likes: [],
        video: {
          id: 50,
          postVideoCollection: null,
          commentVideoCollection: null,
          reviewVideoCollection: 5,
          resolutions: [{
            size: 'original_video',
            id: 2405,
            videoCollectionResolutionId: 50,
            imageCollectionResolutionId: null,
            video: {
              container: 'uxdev-biblo-input-videobucket',
              name: '1464258107327_profile_323.mov',
              type: 'video/quicktime',
              url: 'api/fileContainers/uxdev-biblo-input-videobucket/download/1464258107327_profile_323.mov',
              id: 2416,
              resolutionImageFileId: null,
              resolutionVideoFileId: 2405
            }
          }, {
            size: '854x480',
            id: 2406,
            videoCollectionResolutionId: 50,
            imageCollectionResolutionId: null,
            video: {
              container: 'uxdev-biblo-output-videobucket',
              name: '1464258107327_profile_323.mp4',
              type: 'video/mp4',
              url: 'api/fileContainers/uxdev-biblo-output-videobucket/download/1464258107327_profile_323.mp4',
              id: 2417,
              resolutionImageFileId: null,
              resolutionVideoFileId: 2406
            }
          }]
        },
        owner: {
          raw: {description: 'afasda', displayName: 'Test Mesteren!'},
          description: '“afasda”',
          displayName: 'Test Mesteren!',
          id: 323,
          groups: [],
          postsInGroups: 0,
          image: '/billede/326/small',
          isModerator: false
        },
        image: null,
        html: 'kopper'
      },
      6: {
        pid: '870970-basis:22375733',
        libraryid: '716500',
        worktype: 'book',
        content: 'asfdsfdasaffsafsaf',
        created: '2016-05-26T10:24:11.000Z',
        modified: '2016-05-26T10:24:11.000Z',
        rating: 6,
        markedAsDeleted: null,
        palleid: null,
        id: 6,
        reviewownerid: 323,
        likes: [],
        video: {
          id: 51,
          postVideoCollection: null,
          commentVideoCollection: null,
          reviewVideoCollection: 6,
          resolutions: [{
            size: 'original_video',
            id: 2407,
            videoCollectionResolutionId: 51,
            imageCollectionResolutionId: null,
            video: {
              container: 'uxdev-biblo-input-videobucket',
              name: '1464258248537_profile_323.mov',
              type: 'video/quicktime',
              url: 'api/fileContainers/uxdev-biblo-input-videobucket/download/1464258248537_profile_323.mov',
              id: 2418,
              resolutionImageFileId: null,
              resolutionVideoFileId: 2407
            }
          }, {
            size: '854x480',
            id: 2408,
            videoCollectionResolutionId: 51,
            imageCollectionResolutionId: null,
            video: {
              container: 'uxdev-biblo-output-videobucket',
              name: '1464258248537_profile_323.mp4',
              type: 'video/mp4',
              url: 'api/fileContainers/uxdev-biblo-output-videobucket/download/1464258248537_profile_323.mp4',
              id: 2419,
              resolutionImageFileId: null,
              resolutionVideoFileId: 2408
            }
          }]
        },
        owner: {
          raw: {description: 'afasda', displayName: 'Test Mesteren!'},
          description: '“afasda”',
          displayName: 'Test Mesteren!',
          id: 323,
          groups: [],
          postsInGroups: 0,
          image: '/billede/326/small',
          isModerator: false
        },
        image: null,
        html: 'asfdsfdasaffsafsaf'
      }
    },
    works: {
      '870970-basis:50536661': {
        collection: ['870970-basis:50536661', '870970-basis:51182200'],
        dcTitle: ['Harry Styles'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=50536661&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=53751215671ad7f5a422']
      },
      '870970-basis:51182200': {
        collection: ['870970-basis:50536661', '870970-basis:51182200'],
        dcTitle: ['Harry Styles'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=50536661&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=53751215671ad7f5a422']
      },
      '870970-basis:22629344': {
        collection: ['870970-basis:22629344', '870970-basis:51989252', '870970-basis:29317038', '870970-basis:22252852', '870970-basis:51980247', '870970-basis:25194853', '870970-basis:24168638', '870970-basis:23195151', '870970-basis:27638708', '870970-basis:22513354'],
        dcTitle: ['Harry Potter og De Vises Sten'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22252852&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=b3dae9a94d116a1bee2e']
      },
      '870970-basis:51989252': {
        collection: ['870970-basis:22629344', '870970-basis:51989252', '870970-basis:29317038', '870970-basis:22252852', '870970-basis:51980247', '870970-basis:25194853', '870970-basis:24168638', '870970-basis:23195151', '870970-basis:27638708', '870970-basis:22513354'],
        dcTitle: ['Harry Potter og De Vises Sten'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22252852&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=b3dae9a94d116a1bee2e']
      },
      '870970-basis:29317038': {
        collection: ['870970-basis:22629344', '870970-basis:51989252', '870970-basis:29317038', '870970-basis:22252852', '870970-basis:51980247', '870970-basis:25194853', '870970-basis:24168638', '870970-basis:23195151', '870970-basis:27638708', '870970-basis:22513354'],
        dcTitle: ['Harry Potter og De Vises Sten'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22252852&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=b3dae9a94d116a1bee2e']
      },
      '870970-basis:22252852': {
        collection: ['870970-basis:22629344', '870970-basis:51989252', '870970-basis:29317038', '870970-basis:22252852', '870970-basis:51980247', '870970-basis:25194853', '870970-basis:24168638', '870970-basis:23195151', '870970-basis:27638708', '870970-basis:22513354'],
        dcTitle: ['Harry Potter og De Vises Sten'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22252852&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=b3dae9a94d116a1bee2e']
      },
      '870970-basis:51980247': {
        collection: ['870970-basis:22629344', '870970-basis:51989252', '870970-basis:29317038', '870970-basis:22252852', '870970-basis:51980247', '870970-basis:25194853', '870970-basis:24168638', '870970-basis:23195151', '870970-basis:27638708', '870970-basis:22513354'],
        dcTitle: ['Harry Potter og De Vises Sten'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22252852&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=b3dae9a94d116a1bee2e']
      },
      '870970-basis:25194853': {
        collection: ['870970-basis:22629344', '870970-basis:51989252', '870970-basis:29317038', '870970-basis:22252852', '870970-basis:51980247', '870970-basis:25194853', '870970-basis:24168638', '870970-basis:23195151', '870970-basis:27638708', '870970-basis:22513354'],
        dcTitle: ['Harry Potter og De Vises Sten'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22252852&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=b3dae9a94d116a1bee2e']
      },
      '870970-basis:24168638': {
        collection: ['870970-basis:22629344', '870970-basis:51989252', '870970-basis:29317038', '870970-basis:22252852', '870970-basis:51980247', '870970-basis:25194853', '870970-basis:24168638', '870970-basis:23195151', '870970-basis:27638708', '870970-basis:22513354'],
        dcTitle: ['Harry Potter og De Vises Sten'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22252852&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=b3dae9a94d116a1bee2e']
      },
      '870970-basis:23195151': {
        collection: ['870970-basis:22629344', '870970-basis:51989252', '870970-basis:29317038', '870970-basis:22252852', '870970-basis:51980247', '870970-basis:25194853', '870970-basis:24168638', '870970-basis:23195151', '870970-basis:27638708', '870970-basis:22513354'],
        dcTitle: ['Harry Potter og De Vises Sten'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22252852&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=b3dae9a94d116a1bee2e']
      },
      '870970-basis:27638708': {
        collection: ['870970-basis:22629344', '870970-basis:51989252', '870970-basis:29317038', '870970-basis:22252852', '870970-basis:51980247', '870970-basis:25194853', '870970-basis:24168638', '870970-basis:23195151', '870970-basis:27638708', '870970-basis:22513354'],
        dcTitle: ['Harry Potter og De Vises Sten'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22252852&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=b3dae9a94d116a1bee2e']
      },
      '870970-basis:22513354': {
        collection: ['870970-basis:22629344', '870970-basis:51989252', '870970-basis:29317038', '870970-basis:22252852', '870970-basis:51980247', '870970-basis:25194853', '870970-basis:24168638', '870970-basis:23195151', '870970-basis:27638708', '870970-basis:22513354'],
        dcTitle: ['Harry Potter og De Vises Sten'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22252852&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=b3dae9a94d116a1bee2e']
      },
      '870970-basis:22995154': {
        collection: ['870970-basis:22995154', '870970-basis:29317003', '870970-basis:22639862', '870970-basis:51980220', '870970-basis:25197879', '870970-basis:26239699', '870970-basis:23227932', '870970-basis:22937758', '870970-basis:22937766', '870970-basis:22937774', '870970-basis:27639151'],
        dcTitle: ['Harry Potter og fangen fra Azkaban'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22639862&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=ed8a1badf305e31520c9']
      },
      '870970-basis:29317003': {
        collection: ['870970-basis:22995154', '870970-basis:29317003', '870970-basis:22639862', '870970-basis:51980220', '870970-basis:25197879', '870970-basis:26239699', '870970-basis:23227932', '870970-basis:22937758', '870970-basis:22937766', '870970-basis:22937774', '870970-basis:27639151'],
        dcTitle: ['Harry Potter og fangen fra Azkaban'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22639862&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=ed8a1badf305e31520c9']
      },
      '870970-basis:22639862': {
        collection: ['870970-basis:22995154', '870970-basis:29317003', '870970-basis:22639862', '870970-basis:51980220', '870970-basis:25197879', '870970-basis:26239699', '870970-basis:23227932', '870970-basis:22937758', '870970-basis:22937766', '870970-basis:22937774', '870970-basis:27639151'],
        dcTitle: ['Harry Potter og fangen fra Azkaban'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22639862&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=ed8a1badf305e31520c9']
      },
      '870970-basis:51980220': {
        collection: ['870970-basis:22995154', '870970-basis:29317003', '870970-basis:22639862', '870970-basis:51980220', '870970-basis:25197879', '870970-basis:26239699', '870970-basis:23227932', '870970-basis:22937758', '870970-basis:22937766', '870970-basis:22937774', '870970-basis:27639151'],
        dcTitle: ['Harry Potter og fangen fra Azkaban'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22639862&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=ed8a1badf305e31520c9']
      },
      '870970-basis:25197879': {
        collection: ['870970-basis:22995154', '870970-basis:29317003', '870970-basis:22639862', '870970-basis:51980220', '870970-basis:25197879', '870970-basis:26239699', '870970-basis:23227932', '870970-basis:22937758', '870970-basis:22937766', '870970-basis:22937774', '870970-basis:27639151'],
        dcTitle: ['Harry Potter og fangen fra Azkaban'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22639862&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=ed8a1badf305e31520c9']
      },
      '870970-basis:26239699': {
        collection: ['870970-basis:22995154', '870970-basis:29317003', '870970-basis:22639862', '870970-basis:51980220', '870970-basis:25197879', '870970-basis:26239699', '870970-basis:23227932', '870970-basis:22937758', '870970-basis:22937766', '870970-basis:22937774', '870970-basis:27639151'],
        dcTitle: ['Harry Potter og fangen fra Azkaban'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22639862&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=ed8a1badf305e31520c9']
      },
      '870970-basis:23227932': {
        collection: ['870970-basis:22995154', '870970-basis:29317003', '870970-basis:22639862', '870970-basis:51980220', '870970-basis:25197879', '870970-basis:26239699', '870970-basis:23227932', '870970-basis:22937758', '870970-basis:22937766', '870970-basis:22937774', '870970-basis:27639151'],
        dcTitle: ['Harry Potter og fangen fra Azkaban'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22639862&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=ed8a1badf305e31520c9']
      },
      '870970-basis:22937758': {
        collection: ['870970-basis:22995154', '870970-basis:29317003', '870970-basis:22639862', '870970-basis:51980220', '870970-basis:25197879', '870970-basis:26239699', '870970-basis:23227932', '870970-basis:22937758', '870970-basis:22937766', '870970-basis:22937774', '870970-basis:27639151'],
        dcTitle: ['Harry Potter og fangen fra Azkaban'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22639862&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=ed8a1badf305e31520c9']
      },
      '870970-basis:22937766': {
        collection: ['870970-basis:22995154', '870970-basis:29317003', '870970-basis:22639862', '870970-basis:51980220', '870970-basis:25197879', '870970-basis:26239699', '870970-basis:23227932', '870970-basis:22937758', '870970-basis:22937766', '870970-basis:22937774', '870970-basis:27639151'],
        dcTitle: ['Harry Potter og fangen fra Azkaban'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22639862&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=ed8a1badf305e31520c9']
      },
      '870970-basis:22937774': {
        collection: ['870970-basis:22995154', '870970-basis:29317003', '870970-basis:22639862', '870970-basis:51980220', '870970-basis:25197879', '870970-basis:26239699', '870970-basis:23227932', '870970-basis:22937758', '870970-basis:22937766', '870970-basis:22937774', '870970-basis:27639151'],
        dcTitle: ['Harry Potter og fangen fra Azkaban'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22639862&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=ed8a1badf305e31520c9']
      },
      '870970-basis:27639151': {
        collection: ['870970-basis:22995154', '870970-basis:29317003', '870970-basis:22639862', '870970-basis:51980220', '870970-basis:25197879', '870970-basis:26239699', '870970-basis:23227932', '870970-basis:22937758', '870970-basis:22937766', '870970-basis:22937774', '870970-basis:27639151'],
        dcTitle: ['Harry Potter og fangen fra Azkaban'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22639862&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=ed8a1badf305e31520c9']
      },
      '870970-basis:22677780': {
        collection: ['870970-basis:22677780', '870970-basis:29316945', '870970-basis:22375733', '870970-basis:51980239', '870970-basis:25197887', '870970-basis:25254031', '870970-basis:23227886', '870970-basis:22864416', '870970-basis:22864459', '870970-basis:22864467', '870970-basis:27639097'],
        dcTitle: ['Harry Potter og Hemmelighedernes Kammer'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22375733&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=4b414f67df9cba3b789f']
      },
      '870970-basis:29316945': {
        collection: ['870970-basis:22677780', '870970-basis:29316945', '870970-basis:22375733', '870970-basis:51980239', '870970-basis:25197887', '870970-basis:25254031', '870970-basis:23227886', '870970-basis:22864416', '870970-basis:22864459', '870970-basis:22864467', '870970-basis:27639097'],
        dcTitle: ['Harry Potter og Hemmelighedernes Kammer'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22375733&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=4b414f67df9cba3b789f']
      },
      '870970-basis:22375733': {
        collection: ['870970-basis:22677780', '870970-basis:29316945', '870970-basis:22375733', '870970-basis:51980239', '870970-basis:25197887', '870970-basis:25254031', '870970-basis:23227886', '870970-basis:22864416', '870970-basis:22864459', '870970-basis:22864467', '870970-basis:27639097'],
        dcTitle: ['Harry Potter og Hemmelighedernes Kammer'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22375733&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=4b414f67df9cba3b789f']
      },
      '870970-basis:51980239': {
        collection: ['870970-basis:22677780', '870970-basis:29316945', '870970-basis:22375733', '870970-basis:51980239', '870970-basis:25197887', '870970-basis:25254031', '870970-basis:23227886', '870970-basis:22864416', '870970-basis:22864459', '870970-basis:22864467', '870970-basis:27639097'],
        dcTitle: ['Harry Potter og Hemmelighedernes Kammer'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22375733&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=4b414f67df9cba3b789f']
      },
      '870970-basis:25197887': {
        collection: ['870970-basis:22677780', '870970-basis:29316945', '870970-basis:22375733', '870970-basis:51980239', '870970-basis:25197887', '870970-basis:25254031', '870970-basis:23227886', '870970-basis:22864416', '870970-basis:22864459', '870970-basis:22864467', '870970-basis:27639097'],
        dcTitle: ['Harry Potter og Hemmelighedernes Kammer'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22375733&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=4b414f67df9cba3b789f']
      },
      '870970-basis:25254031': {
        collection: ['870970-basis:22677780', '870970-basis:29316945', '870970-basis:22375733', '870970-basis:51980239', '870970-basis:25197887', '870970-basis:25254031', '870970-basis:23227886', '870970-basis:22864416', '870970-basis:22864459', '870970-basis:22864467', '870970-basis:27639097'],
        dcTitle: ['Harry Potter og Hemmelighedernes Kammer'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22375733&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=4b414f67df9cba3b789f']
      },
      '870970-basis:23227886': {
        collection: ['870970-basis:22677780', '870970-basis:29316945', '870970-basis:22375733', '870970-basis:51980239', '870970-basis:25197887', '870970-basis:25254031', '870970-basis:23227886', '870970-basis:22864416', '870970-basis:22864459', '870970-basis:22864467', '870970-basis:27639097'],
        dcTitle: ['Harry Potter og Hemmelighedernes Kammer'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22375733&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=4b414f67df9cba3b789f']
      },
      '870970-basis:22864416': {
        collection: ['870970-basis:22677780', '870970-basis:29316945', '870970-basis:22375733', '870970-basis:51980239', '870970-basis:25197887', '870970-basis:25254031', '870970-basis:23227886', '870970-basis:22864416', '870970-basis:22864459', '870970-basis:22864467', '870970-basis:27639097'],
        dcTitle: ['Harry Potter og Hemmelighedernes Kammer'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22375733&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=4b414f67df9cba3b789f']
      },
      '870970-basis:22864459': {
        collection: ['870970-basis:22677780', '870970-basis:29316945', '870970-basis:22375733', '870970-basis:51980239', '870970-basis:25197887', '870970-basis:25254031', '870970-basis:23227886', '870970-basis:22864416', '870970-basis:22864459', '870970-basis:22864467', '870970-basis:27639097'],
        dcTitle: ['Harry Potter og Hemmelighedernes Kammer'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22375733&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=4b414f67df9cba3b789f']
      },
      '870970-basis:22864467': {
        collection: ['870970-basis:22677780', '870970-basis:29316945', '870970-basis:22375733', '870970-basis:51980239', '870970-basis:25197887', '870970-basis:25254031', '870970-basis:23227886', '870970-basis:22864416', '870970-basis:22864459', '870970-basis:22864467', '870970-basis:27639097'],
        dcTitle: ['Harry Potter og Hemmelighedernes Kammer'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22375733&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=4b414f67df9cba3b789f']
      },
      '870970-basis:27639097': {
        collection: ['870970-basis:22677780', '870970-basis:29316945', '870970-basis:22375733', '870970-basis:51980239', '870970-basis:25197887', '870970-basis:25254031', '870970-basis:23227886', '870970-basis:22864416', '870970-basis:22864459', '870970-basis:22864467', '870970-basis:27639097'],
        dcTitle: ['Harry Potter og Hemmelighedernes Kammer'],
        workType: ['book'],
        coverUrlFull: ['//moreinfo.addi.dk/2.6/more_info_get.php?lokalid=22375733&attachment_type=forside_stor&bibliotek=870970&source_id=870970&key=4b414f67df9cba3b789f']
      }
    }
  }
};
