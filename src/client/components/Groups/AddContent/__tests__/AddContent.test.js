import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import {expect, assert} from 'chai';
import 'chai-as-promised';
import sinon from 'sinon';
import 'sinon-as-promised';
import AddContent from '../AddContent.component';

describe('Test of AddContent Component', () => {
  const profile = {
    userIsLoggedIn: true,
    hasFilledInProfile: true
  };


  let defaultComponent = null;

  beforeEach(() => {
    defaultComponent = TestUtils.renderIntoDocument(
      <AddContent profile={profile} parentId={1} type="test" redirectTo="some_url"/>);
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
        abort={() => {}}
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
        abort={() => {}}
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
        abort={() => {}}
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
        abort={() => {}}
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
    expect(inputContent.length).to.be.eql(5);
    expect(ReactDOM.findDOMNode(inputContent[0]).type).to.be.eql('hidden');
    expect(ReactDOM.findDOMNode(inputContent[1]).type).to.be.eql('hidden');
    expect(ReactDOM.findDOMNode(inputContent[2]).type).to.be.eql('hidden');
    expect(ReactDOM.findDOMNode(inputContent[3]).type).to.be.eql('hidden');
    expect(ReactDOM.findDOMNode(inputContent[4]).type).to.be.eql('file');
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

 /* disabled for now. Timing issue due to uploadmedia-refactor. TODO: rewrite test to support promise
  it('it should add image to state + show exampleimage', () => {
    const component = TestUtils.renderIntoDocument(
      <AddContent profile={profile} parentId={1} type="test" redirectTo="some_url"/>);
    sinon.stub(component, 'readInput', () => { // eslint-disable-line no-undef
      const state = {attachment: {image: 'some_image_url'}};
      component.setState(state);
    });

   // sinon.stub().resolves('foo')().then(function (value) {
   //   assert.equal(value, 'foo')
   // })

    let fileInput = TestUtils.findRenderedDOMComponentWithClass(component, 'content-add--upload-media');
    expect(ReactDOM.findDOMNode(fileInput).id).to.be.equal('upload-media-test-1');
    TestUtils.Simulate.change(fileInput);

    expect(component.state.attachment.image).to.be.equal('some_image_url');
    expect(component.readInput.called).to.be.equal(true);

    let image = TestUtils.findRenderedDOMComponentWithTag(component, 'img');
    expect(ReactDOM.findDOMNode(image).src).to.contain('some_image_url');

  });*/

  it('it should add textarea value to state', () => {
    let textarea = TestUtils.findRenderedDOMComponentWithTag(defaultComponent, 'textarea');
    textarea.value = 'some test value';
    TestUtils.Simulate.change(textarea);
    expect(defaultComponent.state.text).to.be.equal(textarea.value);
  });

  it('it should call abort action', () => {
    const abort = sinon.spy(); // eslint-disable-line no-undef
    const component = TestUtils.renderIntoDocument(
      <AddContent profile={profile} parentId={1} type="test" redirectTo="some_url" abort={abort}/>);
    let input = TestUtils.findRenderedDOMComponentWithClass(component, 'alert');
    expect(ReactDOM.findDOMNode(input).value).to.be.eql('Fortryd');
    TestUtils.Simulate.click(input);
    expect(abort.called).to.be.equal(true);
  });

  it('it should be hidden if user not logged in', () => {
    profile.userIsLoggedIn = false;
    const component = TestUtils.renderIntoDocument(
      <AddContent profile={profile} parentId={1} type="test" redirectTo="some_url"/>);
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
      <AddContent owner={owner} profile={profile} parentId={1} text="text to test" image="some_url" type="test"
                  redirectTo="some_url"/>);
    let form = TestUtils.scryRenderedDOMComponentsWithTag(component, 'form');
    expect(form.length).to.be.eql(1);
    let textarea = TestUtils.findRenderedDOMComponentWithTag(component, 'textarea');
    expect(textarea.value).to.be.equal('text to test');
    let image = TestUtils.findRenderedDOMComponentWithTag(component, 'img');
    expect(image.src).to.be.contain('some_url');
    let removeImage = TestUtils.findRenderedDOMComponentWithClass(component, 'content-add--remove-media');
    TestUtils.Simulate.click(removeImage);
    expect(() => TestUtils.findRenderedDOMComponentWithTag(component, 'img')).to.throw(Error);
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
      <AddContent owner={owner} profile={profile} parentId={1} text="text to test hest" image="some_url" type="test"
                  redirectTo="some_url" addContentAction={addContentActionMock}/>
    );
    const form = TestUtils.findRenderedDOMComponentWithTag(component, 'form');

    assert(!component.state.isLoading);
    TestUtils.Simulate.submit(form);
    assert(component.state.isLoading);
    done();

    // setTimeout(() => {
    //   console.log("test componennt state2:", component.state );
    //   assert(!component.state.isLoading);
    //   assert(addContentActionMock.called);
    //   assert(addContentActionMock.calledWith(mockContent));
    //   xhrMock.restore();
    //   window.Date.prototype.getHours = h;
    //   done();
    // }, 0);

  });
});
