/**
 * @file
 * Unittesting methods in WorkDetail.component
 */

import React from 'react';
import {shallow} from 'enzyme';

import {WorkDetail} from './../WorkDetail.component';

describe('Unittesting methods in WorkDetail.component', () => {
  let instance = null;
  const mockData = [{
    accessType: ['physical'], creator: ['Mette Finderup'], pid: ['870970-basis:29145253'], language: ['Dansk'],
    title: ['Emmy - konfirmationshys?'], titleFull: ['Emmy - konfirmationshys? : hvem, mig?'], type: ['Bog'],
    workType: ['book']
  }, {
    accessType: ['online'], creator: ['Mette Finderup'], pid: ['870970-basis:29384622'], language: ['Dansk'],
    title: ['Emmy - konfirmationshys?'], titleFull: ['Emmy - konfirmationshys? : hvem, mig???'], type: ['Ebog'],
    workType: ['book']
  }, {
    accessType: ['physical'], creator: ['Mette Finderup'], pid: ['870970-basis:29714746'], language: ['Dansk'],
    title: ['Emmy - konfirmationshys?'], titleFull: ['Emmy - konfirmationshys? : hvem, mig???'],
    type: ['Lydbog (cd-mp3)'], workType: ['audiobook']
  }, {
    accessType: ['online'], creator: ['Mette Finderup'], pid: ['870970-basis:29566097'], language: ['Dansk'],
    title: ['Emmy - konfirmationshys?'], titleFull: ['Emmy - konfirmationshys? : hvem, mig???'], type: ['Lydbog (net)'],
    workType: ['audiobook']
  }];

  beforeEach(() => {
    instance = shallow(
      <WorkDetail
        fullTitle={''}
        collectionDetails={[]}
        profile={{}}
        editText={''}
        toggleReview={() => {}}
        abstract={''}
        title={''}
        creator={''}
        titleSeries={[]}
        descriptionSeries={''}
        displayType={''}
        collection={[]}
        coverUrl={''}
        orderMaterialAction={() => {}}
        checkAvailabilityAction={() => {}}
        resetOrderState={() => {}}
        unselectLibraryFunction={() => {}}
        searchForLibraryAction={() => {}}
        saveProfileAction={() => {}}
        librarySearchResults={[]}
        getWorkOnlineAccessAction={() => {}}
      />
    ).instance();
  });

  it('Ereolen should contain two elements', () => {
    const result = instance.splitByAccessType(mockData);
    expect(result.ereolen).toHaveLength(2);
  });

  it('ereolen_ebooks should not be present', () => {
    const result = instance.splitByAccessType(mockData);
    expect(result.ereolen_ebooks).toBeUndefined();
  });
});
