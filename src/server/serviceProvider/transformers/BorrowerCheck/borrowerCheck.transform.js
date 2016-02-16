'use strict';

/**
 * @file
 * @type {{
 * event: (function()),
 * requestTransform: (function(string, string, Object): *),
 * responseTransform: (function({userId: string, requestStatus: string, raw: XML}): (response.requestStatus|{statusEnum, errorText}))
 * }}
 */
const CheckBorrower = {

  event() {
    return 'borrowerCheck';
  },

  /**
   * @param event
   * @param loanerID
   * @param pincode
   * @param agencyID
   * @returns {Promise}
   */
  requestTransform(event, {loanerID, pincode, agencyID}) {
    return this.callServiceClient('borchk', 'getBorrowerCheckResult', {
      userId: loanerID,
      userPincode: pincode,
      libraryCode: agencyID
    });
  },

  /**
   *
   * @param response
   * @returns {{status: boolean, data: string, errors: Array}}
   */
  responseTransform(response) {
    return {status: true, data: response.requestStatus, errors: []};
  }
};

export default CheckBorrower;
