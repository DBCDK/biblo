'use strict';
/**
 * @file
 * entry point for create group page
 */
import {renderComponent} from '../../App';
import GroupsContainer from './GroupsContainer.component';
import * as actions from  '../../Actions/group.actions';

renderComponent(GroupsContainer, 'content');
