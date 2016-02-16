'use strict';

/**
 * @file: Profile actions
 */
/* eslint-disable no-use-before-define */

import {GET_USER_PROFILE} from '../Constants/action.constants';

export function getProfile() {
  return {
    type: GET_USER_PROFILE
  };
}
