'use strict';

export const profileMock = {
  username: 'jona341k',
  displayName: 'Bobby',
  fullName: null,
  birthday: null,
  favoriteLibrary: {libraryId: '714700'},
  description: null,
  email: null,
  phone: null,
  created: '2016-03-10T09:20:28.744Z',
  lastUpdated: '2016-03-10T09:20:28.744Z',
  hasFilledInProfile: true,
  id: 109,
  userIsLoggedIn: true,
  isModerator: false,
  image: {
    id: 43,
    profileImageCollection: 109,
    groupCoverImageCollectionId: null,
    postImageCollection: null,
    commentImageCollection: null,
    url: {small: '/billede/43/small', medium: '/billede/43/medium', large: '/billede/43/large'}
  },
  submitState: '',
  submitProgress: 0,
  errors: [],
  displayNameExists: false,
  imageFile: null,
  UI: {submitState: '', submitProgress: 0}
};

export const moderatorMock = {
  username: 'soap345i',
  displayName: 'Jens',
  fullName: null,
  birthday: null,
  favoriteLibrary: {libraryId: '714700'},
  description: null,
  email: null,
  phone: null,
  created: '2016-03-10T09:20:28.744Z',
  lastUpdated: '2016-03-10T09:20:28.744Z',
  hasFilledInProfile: true,
  id: 10,
  userIsLoggedIn: true,
  isModerator: true,
  image: {
    id: 42,
    profileImageCollection: 10,
    groupCoverImageCollectionId: null,
    postImageCollection: null,
    commentImageCollection: null,
    url: {small: '/billede/42/small', medium: '/billede/42/medium', large: '/billede/42/large'}
  },
  submitState: '',
  submitProgress: 0,
  errors: [],
  displayNameExists: false,
  imageFile: null,
  UI: {submitState: '', submitProgress: 0}
};
