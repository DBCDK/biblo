/**
 * @file: Check if a group name is taken.
 */

const checkIfGroupNameExistsTransform = {
  event() {
    return 'checkIfGroupNameExists';
  },

  requestTransform(event, {groupName}) {
    return this.callServiceClient('community', 'checkIfGroupNameExists', {groupName});
  },

  responseTransform(response) {
    const data = {exists: true, errors: [], statusCode: 200};

    try {
      data.statusCode = response.statusCode;
      data.exists = JSON.parse(response.body).count > 0;
    }
    catch (err) {
      data.statusCode = 500;
      data.errors.push('Error in response from community service');
    }

    return data;
  }
};

export default checkIfGroupNameExistsTransform;
