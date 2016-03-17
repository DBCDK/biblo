'use strict';

/**
 *
 * @param profile: Profile from communityservice
 * @param isPublic: Whether the profile is public or the current users. This determines how much info should be sent.
 * @param size: Which size the profile image should be.
 * @returns {{Profile Object}}
 */

export default function profileParser(profile = {}, isPublic = false, size = false) {
  let p = {};

  p.description = profile.description;
  p.displayName = profile.displayName || 'Anonym';
  p.id = profile.id || 0;
  p.groups = profile.groups || [];

  if (profile.image && profile.image.id) {
    p.image = {
      thumbnail: `/billede/${profile.image.id}/thumbnail`,
      small: `/billede/${profile.image.id}/small`,
      smallSquare: `/billede/${profile.image.id}/small-square`,
      medium: `/billede/${profile.image.id}/medium`,
      mediumSquare: `/billede/${profile.image.id}/medium-square`,
      large: `/billede/${profile.image.id}/large`,
      largeSquare: `/billede/${profile.image.id}/large-square`
    };
  }
  else {
    p.image = {
      thumbnail: '/no_profile.png',
      small: '/no_profile.png',
      smallSquare: '/no_profile.png',
      medium: '/no_profile.png',
      mediumSquare: '/no_profile.png',
      large: '/no_profile.png',
      largeSquare: '/no_profile.png'
    };
  }

  if (size && p.image.hasOwnProperty(size)) {
    p.image = p.image[size];
  }

  if (!isPublic) {
    p.username = profile.username;
    p.favoriteLibrary = profile.favoriteLibrary;
    p.email = profile.email;
    p.phone = profile.phone;
    p.created = profile.created;
    p.lastUpdated = profile.lastUpdated;
    p.birthday = profile.birthday;
    p.fullName = profile.fullName;
  }

  return p;
}
