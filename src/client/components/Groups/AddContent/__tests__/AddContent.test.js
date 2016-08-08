import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import {expect, assert} from 'chai';
import $ from 'teaspoon';

import 'chai-as-promised';
import sinon from 'sinon';
import 'sinon-as-promised';

import AddContent from '../AddContent.component';

describe('Test of AddContent Component', () => {
  const profile = {
    userIsLoggedIn: true,
    hasFilledInProfile: true
  };

  const noop = () => {
  };

  let defaultComponent = null;

  beforeEach(() => {
    defaultComponent = TestUtils.renderIntoDocument(
      <AddContent
        profile={profile}
        parentId={1}
        type="test"
        redirectTo="some_url"
        abort={noop}
        addContentAction={noop}
        getMoreWorks={noop}
      />
    );
  });

  afterEach(() => {
    defaultComponent = null;
  });

  it('onSubmit method should add an error if state.text is empty', () => {
    let component = TestUtils.renderIntoDocument(
      <AddContent
        profile={profile}
        parentId={1}
        type="test"
        redirectTo="some_url"
        abort={noop}
        addContentAction={noop}
        getMoreWorks={noop}
      />
    );

    const form = TestUtils.findRenderedDOMComponentWithTag(component, 'form');
    TestUtils.Simulate.submit(form);
    TestUtils.findRenderedDOMComponentWithClass(component, 'message');
  });

  it('readInput should be rejected if given filetype is neither image or video', () => {
    let component = TestUtils.renderIntoDocument(
      <AddContent
        profile={profile}
        parentId={1}
        type="test"
        redirectTo="some_url"
        abort={noop}
        addContentAction={noop}
        getMoreWorks={noop}
      />
    );

    const input = {
      target: {
        files: [
          {
            type: 'test/hest'
          }
        ]
      }
    };

    expect(component.readInput(input)).to.be.rejected; // eslint-disable-line no-unused-expressions
  });

  it('readInput method should call handleImage method if file is of type image', () => {
    let component = TestUtils.renderIntoDocument(
      <AddContent
        profile={profile}
        parentId={1}
        type="test"
        redirectTo="some_url"
        abort={noop}
        addContentAction={noop}
        getMoreWorks={noop}
      />
    );

    const mock = sinon.mock(component); // eslint-disable-line no-undef
    const expectation = mock.expects('handleImage');

    const input = {
      target: {
        files: [
          {
            type: 'image/jpeg'
          }
        ]
      }
    };

    component.readInput(input);
    assert.isTrue(expectation.called, 'handleImage was called');
    mock.restore();
  });

  it('readInput method should call handleVideo method if file is of type image', () => {
    let component = TestUtils.renderIntoDocument(
      <AddContent
        profile={profile}
        parentId={1}
        type="test"
        redirectTo="some_url"
        abort={noop}
        addContentAction={noop}
        getMoreWorks={noop}
      />
    );

    const mock = sinon.mock(component); // eslint-disable-line no-undef
    const expectation = mock.expects('handleVideo');

    const input = {
      target: {
        files: [
          {
            type: 'video/mov'
          }
        ]
      }
    };

    component.readInput(input);
    assert.isTrue(expectation.called, 'handleVideo was called');
    mock.restore();
  });

  it('it should render form', () => {
    const component = defaultComponent;
    let form = TestUtils.findRenderedDOMComponentWithTag(component, 'form');
    const method = ReactDOM.findDOMNode(form).method.toUpperCase();
    expect(method).to.equal('POST');
    let inputContent = TestUtils.scryRenderedDOMComponentsWithTag(component, 'input');
    expect(inputContent.length).to.be.eql(7);
    expect(ReactDOM.findDOMNode(inputContent[0]).type).to.be.eql('hidden');
    expect(ReactDOM.findDOMNode(inputContent[1]).type).to.be.eql('hidden');
    expect(ReactDOM.findDOMNode(inputContent[2]).type).to.be.eql('hidden');
    expect(ReactDOM.findDOMNode(inputContent[3]).type).to.be.eql('hidden');
    expect(ReactDOM.findDOMNode(inputContent[4]).type).to.be.eql('hidden');
    expect(ReactDOM.findDOMNode(inputContent[5]).type).to.be.eql('hidden');
    expect(ReactDOM.findDOMNode(inputContent[6]).type).to.be.eql('file');
    let submit = TestUtils.findRenderedDOMComponentWithTag(component, 'button');
    expect(submit.type).to.be.eql('submit');
  });

  it('it should render form with properties', () => {
    const component = defaultComponent;
    let form = TestUtils.findRenderedDOMComponentWithTag(component, 'form');
    expect(ReactDOM.findDOMNode(form).action).to.have.string('/grupper/content/test');
    let input = TestUtils.findRenderedDOMComponentWithClass(component, 'redirect');
    expect(ReactDOM.findDOMNode(input).value).to.be.eql('some_url');
  });

  it('it should add textarea value to state', () => {
    let textarea = TestUtils.findRenderedDOMComponentWithTag(defaultComponent, 'textarea');
    textarea.value = 'some test value';
    TestUtils.Simulate.change(textarea);
    expect(defaultComponent.state.text).to.be.equal(textarea.value);
  });

  it('it should be hidden if user not logged in', () => {
    profile.userIsLoggedIn = false;
    const component = TestUtils.renderIntoDocument(
      <AddContent
        profile={profile}
        parentId={1}
        type="test"
        redirectTo="some_url"
        abort={noop}
        addContentAction={noop}
        getMoreWorks={noop}
      />
    );
    let form = TestUtils.scryRenderedDOMComponentsWithTag(component, 'form');
    expect(form.length).to.be.eql(0);
    let aTag = TestUtils.findRenderedDOMComponentWithTag(component, 'a');
    expect(ReactDOM.findDOMNode(aTag).href).to.contain('login');
  });

  it('it should be in edit mode if id is passed', () => {
    profile.userIsLoggedIn = true;
    profile.id = 1;
    const owner = {
      id: 1
    };
    const component = TestUtils.renderIntoDocument(
      <AddContent
        owner={owner}
        profile={profile}
        parentId={1}
        text="text to test"
        image="some_url"
        type="test"
        redirectTo="some_url"
        abort={noop}
        addContentAction={noop}
        getMoreWorks={noop}
      />
    );

    let form = TestUtils.scryRenderedDOMComponentsWithTag(component, 'form');
    expect(form.length).to.be.eql(1);
    let textarea = TestUtils.findRenderedDOMComponentWithTag(component, 'textarea');
    expect(textarea.value).to.be.equal('text to test');
    let image = TestUtils.scryRenderedDOMComponentsWithTag(component, 'img');
    expect(image[0].src).to.be.contain('some_url');
    let removeImage = TestUtils.findRenderedDOMComponentWithClass(component, 'content-add--remove-media');
    TestUtils.Simulate.click(removeImage);
    expect(TestUtils.scryRenderedDOMComponentsWithTag(component, 'img').length).to.eql(1);
  });

  it('It should submit form on submit event', (done) => {

    // var h = window.Date.prototype.getHours;
    window.Date.prototype.getHours = function() {
      return 12;
    };

    profile.userIsLoggedIn = true;
    profile.id = 1;

    const owner = {
      id: 1
    };

    const mockContent = {
      title: ' ',
      content: 'This is a test',
      timeCreated: '2016-03-21T14:09:35.000Z',
      id: 63,
      postownerid: 7,
      postcontainergroupid: 1,
      postid: null,
      groupid: 1,
      owner: {
        description: '',
        displayName: 'Hesteviskeren fra Heste',
        id: 7,
        groups: [],
        image: '/billede/9/small'
      },
      likes: [],
      image: null,
      comments: [],
      html: 'This is a test'
    };

    const addContentActionMock = sinon.stub(); // eslint-disable-line no-undef
    const xhrMock = sinon.useFakeXMLHttpRequest(); // eslint-disable-line no-undef
    xhrMock.onCreate = (xhr) => {
      setTimeout(() => xhr.respond(200, {'Content-Type': 'application/json'}, JSON.stringify(mockContent)), 0);
    };

    const component = TestUtils.renderIntoDocument(
      <AddContent
        owner={owner}
        profile={profile}
        parentId={1}
        text="text to test hest"
        image="some_url"
        type="test"
        redirectTo="some_url"
        addContentAction={addContentActionMock}
        abort={noop}
        getMoreWorks={noop}
      />
    );
    const form = TestUtils.findRenderedDOMComponentWithTag(component, 'form');

    assert(!component.state.isLoading);
    TestUtils.Simulate.submit(form);
    assert(component.state.isLoading);
    xhrMock.restore();
    done();
  });

  it('Should render modal when button is clicked, no review data', () => {
    profile.userIsLoggedIn = true;
    profile.id = 1;
    profile.reviews = {data: []};

    const owner = {
      id: 1
    };

    let component = (
      <AddContent
        owner={owner}
        profile={profile}
        parentId={1}
        type="test"
        redirectTo="some_url"
        abort={noop}
        addContentAction={noop}
        getMoreWorks={noop}
      />
    );

    let $root = $(component).render();
    // Can't click the button due to FeaturePreview so emulate click by setting state
    $root.state('showAddReviews', true);

    const reviewsText = $root.find('.attach-review-modal--reviews-container').text();
    assert.equal(reviewsText, 'Vi kunne ikke finde nogen anmeldelser, prøv at oprette en ny!', 'Should display message when no data is present.');
  });

  it('Should render reviews in modal when data is available', () => {
    profile.userIsLoggedIn = true;
    profile.id = 1;
    profile.reviews = {
      data: [{
        pid: 'testpid',
        content: 'bob er sej!',
        id: 1234,
        worktype: 'book'
      }],
      reviewsCount: 1
    };

    const works = {
      testpid: {
        title: 'bob',
        creator: 'kop'
      }
    };

    const owner = {
      id: 1
    };

    let component = (
      <AddContent
        owner={owner}
        profile={profile}
        parentId={1}
        works={works}
        type="test"
        redirectTo="some_url"
        abort={noop}
        addContentAction={noop}
        getMoreWorks={noop}
      />
    );

    let $root = $(component).render();
    // Can't click the button due to FeaturePreview so emulate click by setting state
    $root.state('showAddReviews', true);

    const radioInputValue = $root.find('.attach-review-modal--radio-btn-input').props().value;
    assert.equal(radioInputValue, 1234, 'the radio buttons value should equal the id of the review');

    $root.find('.attach-review-modal--radio-btn-input').trigger('change');
    $root.find('.attach-review-modal--buttons-container > a').trigger('click');

    assert.isTrue(!!$root.state().attachment.review);
  });
});
