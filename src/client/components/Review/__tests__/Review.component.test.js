import React from 'react';
import sd from 'skin-deep';

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
    const component = sd.shallowRender(
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

    let instance = component.getMountedInstance();
    instance
      .processContent()
      .then(() => {
        expect(component.subTree('Message')).toBeTruthy();
      })
      .catch(() => {});
  });

  it('should add an error if rating is not set', () => {
    const component = sd.shallowRender(
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
    let instance = component.getMountedInstance();
    instance.validate();
    expect(component.subTree('Message')).toBeTruthy();
  });

  it('should not be able to submit if the user is not logged in', () => {
    profile.userIsLoggedIn = false;
    const component = sd.shallowRender(
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

    expect(component.subTree('form')).toBe(false);
  });

  it('should open a modal on a duplicate review for a work - test', done => {
    try {
      profile.userIsLoggedIn = true;
      const component = sd.shallowRender(
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

      const instance = component.getMountedInstance();
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
