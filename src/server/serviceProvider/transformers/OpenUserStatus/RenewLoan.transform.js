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

  requestTransform(event, {loanId}, connection) {
    if (connection.request.session.passport) {
      const favouriteLibrary = connection.request.session.passport.user.profile.profile.favoriteLibrary;
      const params = {
        agencyId: favouriteLibrary.libraryId,
        loanId: loanId,
        userId: favouriteLibrary.loanerId,
        userPincode: favouriteLibrary.pincode
      };

      if (params.agencyId.toLowerCase().indexOf('dk-') !== 0) {
        params.agencyId = 'DK-' + params.agencyId;
      }

      return this.callServiceClient('openuserstatus', 'renewLoan', params);
    }

    return Promise.reject('user not logged in');
  },

  responseTransform(response, {createdEpoch}, connection) {
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
    } catch (err) {
      this.logger.error('Error when parsing response from OpenUserStatus', err);

      result.error = {
        message: 'Error when parsing response from OpenUserStatus',
        error: err.message || err
      };
    }

    if (!result.error && !result.userstatusError && createdEpoch) {
      const userId = connection.request.session.passport.user.profileId;
      this.callServiceClient('aws', 'hardDeleteUserMessage', {
        userId: userId,
        createdEpoch: createdEpoch,
        messageType: 'type-orderExpiresSoon'
      })
        .then(res => {
          this.logger.info('Message was successfully deleted from DynamoDB', {
            response: res,
            params: {
              userId: userId,
              createdEpoch: createdEpoch,
              messageType: 'type-orderExpiresSoon'
            }
          });
        })
        .catch(e => {
          this.logger.error('An error occured while deleting a message from DynamoDB', {
            error: e,
            params: {
              userId: userId,
              createdEpoch: createdEpoch,
              messageType: 'type-orderExpiresSoon'
            }
          });
        });
    }

    return result;
  }
};

export default RenewLoanTransform;
