/**
 * @file
 * Unittesting methods in MultiVolumeDisplay.component.test.js
 */

import React from 'react';
import {shallow} from 'enzyme';
import {krigerkattene} from './krigerkattene.mock';
import {MultiVolumeDisplay} from './../MultiVolumeDisplay.component';

describe('Unittesting methods in MultiVolumeDisplay.component.test.js', () => {
  let tree = null;

  beforeEach(() => {
    tree = shallow(
      <MultiVolumeDisplay
        multivolume={krigerkattene}
        multivolumeTitle={'Krigerkattene'}
        getMetadataAction={jest.fn()}
        multivolumeMetadata={{}}
      />
    );
  });

  it('Should match snapshot', () => {
    expect(tree).toMatchSnapshot();
  });

  it('Should render 6 items', () => {
    expect(tree.find('.work-detail--series-display--edition-container')).toHaveLength(6);
  });
});
