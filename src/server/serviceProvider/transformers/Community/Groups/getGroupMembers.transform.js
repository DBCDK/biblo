/**
 * @file: This transform gets a group from the community service, if a user is logged in, it also checks if that user
 *   is following the group.
 */

import parseProfile from '../../../parsers/profile.parser';

const GetGroupTransform = {

  event() {
    return 'getGroupMembers';
  },

  requestTransform(event, {id}) {
    return this.callServiceClient('community', 'getGroupMembers', {id, filter: {include: 'image'}});
  },

  responseTransform(response, query) {
    const filteredMembers = query.ownerId ? response.filter(m => m.id !== query.ownerId) : response;
    const members = filteredMembers.map((member) => {
      return parseProfile(member, true, 'small');
    });

    return {members};
  }
};

export default GetGroupTransform;
