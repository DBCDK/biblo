import {parseGetUserStatusResponse} from '../../parsers/userstatus.parser';

const GetUserStatusTransform = {
  event() {
    return 'getUserStatus';
  },

  requestTransform(event, {agencyId, userId, pinCode}) {
    const params = {
      agencyId,
      userId,
      pinCode
    };

    return this.callServiceClient('openuserstatus', 'getUserStatus', params);
  },

  responseTransform(response) {
    return parseGetUserStatusResponse(response);
  }

};

export default GetUserStatusTransform;
