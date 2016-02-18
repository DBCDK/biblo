'use strict';

/**
 * @file: GroupView reducer
 */

import parseJsonData from '../Utils/parseJsonData.js';
import {GET_GROUP} from '../Constants/action.constants';

const defaultState = {
  name: '',
  description: '',
  id: null,
  image: 'http://lorempixel.com/200/200/',
  posts: []
};


const groupData = parseJsonData('JSONDATA', 'groupData');
const initialState = Object.assign({}, defaultState, groupData);

export default function groupViewReducer(state = initialState, action = {}) {
  Object.freeze(state);
  switch (action.type) {
    case GET_GROUP:
      return state;

    default:
      return state;
  }
}
