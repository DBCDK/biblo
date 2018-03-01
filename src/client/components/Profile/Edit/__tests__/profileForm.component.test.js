/**
 * @file
 * Unittesting methods in profileForm.component.test.js
 */

import React from 'react';
import {mount} from 'enzyme';
import ProfileForm from './../profileForm.component';

describe('Testing profileForm.component.test.js', () => {
  it('Dirty displayName should be sanitized before submission', () => {
    const submit = jest.fn();
    const displayName = '<script>console.log("test");</script>test';
    const expected = 'test';
    const wrapper = mount(
      <ProfileForm
        changeImageAction={jest.fn()}
        errors={[]}
        profileImageSrc={''}
        submit={submit}
        searchAction={jest.fn()}
        searchElements={[]}
        unselectLibraryFunction={jest.fn()}
        checkDisplayNameFunction={jest.fn()}
        favoriteLibrary={{
          libraryAddress: 'TestBibAddress',
          libraryId: '123456',
          libraryName: 'TestBib',
          loanerId: '1234567890',
          pincode: '1234'
        }}
        displayName={displayName}
      />
    );

    // submit the form
    wrapper.instance().profileFormRef.onsubmit();

    // Expecting second argument to sanitized part og displayName
    expect(submit.mock.calls[0][1]).toEqual(expected);
  });
});
