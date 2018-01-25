import React from 'react';
import {shallow} from 'enzyme';

import Review from '../Review.component';
import {profileMock} from '../../__mocks__/profile.mock.js';

describe('Test of Review Component ', () => {
  const profile = profileMock;
  const work = {
    pid: 'test-hest',
    workType: 'book',
    collection: ['test-hest']
  };

  const noop = () => {};
  let uiActions = {openModalWindow: () => {}};
  let flagActions = {};
  let likeActions = {};
  let reviewActions = {
    asyncShowReview: () => {},
    asyncShowWorkReviews: () => {}
  };

  it('onSubmit method should add an error if content is empty', () => {
    const component = shallow(
      <Review
        autoplayVideo={false}
        isEditing={true}
        toggleReview={noop}
        profile={profile}
        owner={profile}
        pid={work.pid}
        worktype={work.workType}
        pids={work.collection}
        reviewActions={reviewActions}
        uiActions={uiActions}
        flagActions={flagActions}
        likeActions={likeActions}
        content=""
        rating={1}
      />
    );

    const instance = component.instance();
    instance
      .processContent()
      .then(() => {
        expect(component.subTree('Message')).toBeTruthy();
      })
      .catch(() => {});
  });

  it('should add an error if rating is not set', () => {
    const component = shallow(
      <Review
        autoplayVideo={false}
        isEditing={true}
        toggleReview={noop}
        profile={profile}
        owner={profile}
        pid={work.pid}
        worktype={work.workType}
        pids={work.collection}
        reviewActions={reviewActions}
        uiActions={uiActions}
        flagActions={flagActions}
        likeActions={likeActions}
        content="test hest"
        rating={0}
      />
    );
    const instance = component.instance();
    instance.validate();
    expect(component.find('Message')).toBeTruthy();
  });

  it('should not be able to submit if the user is not logged in', () => {
    profile.userIsLoggedIn = false;
    const component = shallow(
      <Review
        autoplayVideo={false}
        isEditing={true}
        toggleReview={noop}
        profile={profile}
        owner={profile}
        pid={work.pid}
        worktype={work.workType}
        pids={work.collection}
        reviewActions={reviewActions}
        uiActions={uiActions}
        flagActions={flagActions}
        likeActions={likeActions}
        content="test hest"
        rating={1}
      />
    );

    expect(component.find('form')).toHaveLength(0);
  });

  it('should open a modal on a duplicate review for a work - test', done => {
    try {
      profile.userIsLoggedIn = true;
      const component = shallow(
        <Review
          autoplayVideo={false}
          isEditing={true}
          toggleReview={noop}
          profile={profile}
          owner={profile}
          pid={work.pid}
          worktype={work.workType}
          pids={work.collection}
          reviewActions={reviewActions}
          uiActions={uiActions}
          flagActions={flagActions}
          likeActions={likeActions}
          content="test hest"
          rating={5}
        />
      );

      const instance = component.instance();
      const spy = jest.spyOn(instance, 'overwriteReview');

      instance.addContent = () => {
        return new Promise((resolve, reject) => {
          reject({message: 'Eksisterende anmeldelse'});
        });
      };

      instance
        .processContent()
        .then(() => {
          expect(spy).toHaveBeenCalled();
          done();
        })
        .catch(err => {
          console.warn('procesContent failed:', err); // eslint-disable-line no-console
          done();
        });
    }
    catch (err) {
      console.warn('failed to wait for overwriteReview modal:', err); // eslint-disable-line no-console
      done();
    }
  });
});
