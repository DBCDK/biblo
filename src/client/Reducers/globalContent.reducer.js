/**
 * @file: Profile reducer
 */

import parseJsonData from '../Utils/parseJsonData';

const initialState = parseJsonData('globalContent', 'globalContent');

export default function globalDataReducer(state = initialState) {
  return state;
}
