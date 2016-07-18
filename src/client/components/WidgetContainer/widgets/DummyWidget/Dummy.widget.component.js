/**
 * @file: Dummy widget used for tests, and an example of the simplest widget possible
 */

import React, {Component, PropTypes} from 'react';

// A widget is just a normal react component, with a specific subset of props.
// Generally a widget should get all initial data from the CMS that controls it,
// And request whatever remains, via our actions.
// All data received after the CMS data, for a specific widget should be namespaced in the reducer to the widget name.
export class DummyWidget extends Component {
  render() {
    return (
      <span className="dummy-widget">This is a dummy widget!</span>
    );
  }
}

DummyWidget.displayName = 'DummyWidget';

// These are all the props a widget gets
DummyWidget.propTypes = {
  // This is an object containing all the actions in widget.actions.js
  widgetActions: PropTypes.object.isRequired,

  // This is an object containing data as passed from the CMS.
  widgetConfig: PropTypes.object.isRequired,

  // This is a string, with the name of the widget location (for example: FrontPageTop)
  // This is how we specify where a specific widget goes.
  widgetLocationName: PropTypes.string.isRequired,

  // This is an object containing the property from the widgetReducer that matches the widgetName.
  widgetReducerProp: PropTypes.object,

  // This is the entire state from the widgetReducer.
  widgetState: PropTypes.object.isRequired
};
