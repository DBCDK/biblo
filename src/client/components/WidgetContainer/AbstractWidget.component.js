/**
 * @file:
 */

import {Component, PropTypes} from 'react';

/**
 * @Class: AbstractWidget
 * This class defines a few helper methods on top of React.Component to aid widgets.
 */
export class AbstractWidget extends Component {
  constructor(props) {
    super(props);

    // No props passed to super. Throw error to notify.
    if (!props) {
      throw new Error('No props declared! Did you remember to call super(props); ?');
    }

    // Could not find widgetActions. This should only happen if the component is initialized outside widget context.
    if (!props.widgetActions) {
      throw new Error('All widgets must have widgetActions!');
    }

    // Could not find method callServiceProvider!
    // This means we are not dealing with widgetAction, most likely an incomplete mock.
    if (!props.widgetActions.callServiceProvider) {
      throw new Error('Could not find callServiceProvider in widgetActions, invalid widget initialization!');
    }
  }

  /**
   * This function dispatches an event that gets caught by serviceProviderReduxMiddleware.
   * The middleware then sets up a listener and calls the biblo service provider with the transform event (passed in through the parameter).
   * The listener dispatches a redux action with type = `${event}Response`.
   * This redux action has data = resultFromServiceProvider.
   * @param {String} event - The event of the transform you want to call.
   * @param {*} query - The query sent to the transform.
   */
  callServiceProvider(event, query) {
    this.props.widgetActions.callServiceProvider(event, query);
  }

  render() {
    // This is an abstract component, not for rendering!
    throw new Error('Child class missing render function or calling super from render!');
  }
}

AbstractWidget.displayName = 'AbstractWidget';
AbstractWidget.propTypes = {
  // This is an object containing all the actions in widget.actions.js
  widgetActions: PropTypes.object.isRequired,

  // This is an object containing data as passed from the CMS.
  widgetConfig: PropTypes.object.isRequired,

  // This is a string, with the name of the widget location (for example: FrontPageTop)
  // This is how we specify where a specific widget goes.
  widgetLocationName: PropTypes.string.isRequired,

  // This is an object containing the property from the widgetReducer that matches the widgetName.
  widgetReducerProp: PropTypes.any,

  // This is the entire state from the widgetReducer.
  widgetState: PropTypes.object.isRequired
};
