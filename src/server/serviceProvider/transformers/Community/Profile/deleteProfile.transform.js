/**
 * @file
 * Delete a profile.
 */
const deleteProfile = {
  /**
   * @return {string}
   */
  event() {
    return 'deleteProfile';
  },

  /**
   * @param {String} event
   * @param {Object} query
   */
  async requestTransform(event, {profile, transferGroups}) {
    if (transferGroups) {
      const groupsAreTransfered = await this.callServiceClient(
        'community',
        'transferGroups',
        {uid: profile.id}
      );
      if (!groupsAreTransfered) {
        return Promise.reject(new Error('Groups could not be transfered'));
      }
      groupsAreTransfered.forEach(groupId => {
        this.invalidateCache(`getGroup*"id":${groupId},*`);
      });
    } 
    else {
      const groups = await this.callServiceClient(
        'community',
        'getGroupsOwnedByUser',
        { uid: profile.id }
      );
      if (groups) {
        groups.forEach(group => {
          this.invalidateCache(`getGroup*"id":${group.id},*`);
        });
      }
      this.invalidateCache("groupSuggest*");
    }
    await this.callServiceClient('aws', 'deleteAllUserMessages', {userId: profile.id});
    return this.callServiceClient('community', 'deleteProfile', {id: profile.id});
  },

  /**
   * @param {Object} response
   * @return {Object}
   */
  responseTransform(response) {
    if (response.statusCode !== 200) {
      throw new Error('Call to community service, with method deleteProfile failed');
    }
    return JSON.parse(response.body);
  }
};

export default deleteProfile;
