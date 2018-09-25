import {parseGetUserStatusResponse} from '../../parsers/userstatus.parser';

const GetUserStatusTransform = {
  event() {
    return 'getUserStatus';
  },

  getFavouriteLibrary(connection) {
    let favouriteLibrary = false;
    if (connection.request.session.passport) {
      const passport = connection.request.session.passport;
      if (
        passport.user.profile.profile.favoriteLibrary.libraryId &&
        passport.user.profile.profile.favoriteLibrary.loanerId &&
        passport.user.profile.profile.favoriteLibrary.pincode
      ) {
        favouriteLibrary = {
          agencyId: connection.request.session.passport.user.profile.profile.favoriteLibrary.libraryId,
          userId: connection.request.session.passport.user.profile.profile.favoriteLibrary.loanerId,
          pinCode: connection.request.session.passport.user.profile.profile.favoriteLibrary.pincode
        };
      }
    }

    return favouriteLibrary;
  },

  requestTransform(event, {agencyId, userId, pinCode}, connection) {
    let params;

    if ((!agencyId || !userId || !pinCode) && this.getFavouriteLibrary(connection)) {
      params = this.getFavouriteLibrary(connection);
    } else {
      params = {
        agencyId,
        userId,
        pinCode
      };
    }

    if (params.agencyId.toLowerCase().indexOf('dk-') !== 0) {
      params.agencyId = 'DK-' + params.agencyId;
    }

    return this.callServiceClient('openuserstatus', 'getUserStatus', params);
  },

  responseTransform(response) {
    return parseGetUserStatusResponse(response);
  }
};

export default GetUserStatusTransform;
