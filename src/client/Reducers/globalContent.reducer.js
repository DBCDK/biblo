/**
 * @file: Profile reducer
 */

import parseJsonData from '../Utils/parseJsonData';

import {includes, filter, isArray} from 'lodash';

const initialState = parseJsonData('globalContent', 'globalContent');

export default function globalDataReducer(state = initialState, action = {}) {
  return state;
}
