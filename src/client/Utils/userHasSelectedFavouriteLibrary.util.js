/**
 * Takes the entire profile object as argument and checks whether the given use completely has filled library
 * information.
 *
 * @param {object} profile See initialState in profile.reducer.js
 * @return {boolean}
 */
export function userHasSelectedFavouriteLibrary(profile) {
  let hasFilled = false;
  if (profile.hasOwnProperty('favoriteLibrary')) {
    hasFilled = !!(
      profile.favoriteLibrary.libraryId &&
      profile.favoriteLibrary.libraryId.length &&
      profile.favoriteLibrary.loanerId &&
      profile.favoriteLibrary.loanerId.length &&
      profile.favoriteLibrary.pincode &&
      profile.favoriteLibrary.pincode.length
    );
  }

  return hasFilled;
}
