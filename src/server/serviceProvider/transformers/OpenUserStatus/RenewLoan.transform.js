/**
 * @file
 * Transform handling renewal of one loan.
 * THe transform will only handle renewal of one single loan although the service aceppts requests for renewal of
 * several loans at once.
 */

const RenewLoanTransform = {
  event() {
    return 'renewLoan';
  },

  requestTransform(event, {id}, connection) {
    if (connection.request.session.passport) {
      const favouriteLibrary = connection.request.session.passport.user.profile.profile.favoriteLibrary;
      const params = {
        agencyId: favouriteLibrary.libraryId,
        loanId: id,
        userId: favouriteLibrary.loanerId,
        userPincode: favouriteLibrary.pincode

      };

      return this.callServiceClient('openuserstatus', 'renewLoan', params);
    }

    return Promise.reject('user not logged in');
  },

  responseTransform(response) {
    const result = {
      loanId: response.loanId,
      message: null,
      userstatusError: false,
      error: null
    };

    try {
      const userStatusResponse = response['ous:renewLoanResponse']['ous:renewLoanStatus'][0];

      // Setting loanId to match what came from OpenUserStatus
      result.loanId = userStatusResponse['ous:loanId'][0];

      // Check if an error was returned form OpenUserStatus
      if (userStatusResponse['ous:renewLoanError']) {
        result.userstatusError = true;
        result.message = userStatusResponse['ous:renewLoanError'][0];
      }
    }
    catch (err) {
      this.logger.error('Error when parsing response from OpenUserStatus', err);

      result.error = {
        message: 'Error when parsing response from OpenUserStatus',
        error: err.message || err
      };
    }

    return result;
  }
};

export default RenewLoanTransform;
