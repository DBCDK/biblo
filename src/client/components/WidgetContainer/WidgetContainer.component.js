/**
 * @file: WidgetContainer.component.js is the generic widget component which connect widgets to their data,
 * and renders them where they need to be rendered.
 *
 * @usage:
 * <WidgetContainer
 *   widgetLocationName="A string which describes the location"
 *   widgetState={[Object containing the output from the widgetReducer]}
 *   widgetActions{[Object containing all the methods related to widgets]}
 * />
 *
 */

import React, {Component, PropTypes} from 'react';
import widgetComponents from './widgets';

class WidgetContainer extends Component {
  getTitle(widgetConfig = {}, classNames = '') {
    let title = <span className="widget--no--title"/>;

    const titleClasses = `widget--title--generic ${classNames}`;
    if (widgetConfig.showTitle) {
      if (widgetConfig.title) {
        title = <h2 className={titleClasses}>{widgetConfig.title}</h2>;
      }
      else if (widgetConfig.displayTitle) {
        title = <h2 className={titleClasses}>{widgetConfig.displayTitle}</h2>;
      }
    }

    return title;
  }

  getStyles(widgetConfig = {}) {
    const styles = {};

    if (widgetConfig.backgroundColor) {
      styles.backgroundColor = widgetConfig.backgroundColor;
    }

    if (widgetConfig.backgroundImageUrl) {
      styles.backgroundImage = `url(${widgetConfig.backgroundImageUrl})`;
    }

    return styles;
  }

  getComponent(widgetConfig, widgetName) {
    const CurrentWidget = widgetComponents[widgetName];

    if (!CurrentWidget) {
      return (<span className="widget--not--found"/>);
    }

    // And we get the relevant state for that widget.
    const widgetReducerProp =
      this.props.widgetState[widgetName] ||
      this.props.widgetState[widgetName.replace('Widget', '')];

    return (
      <CurrentWidget
        widgetLocationName={this.props.widgetLocationName}
        widgetState={this.props.widgetState}
        widgetActions={this.props.widgetActions}
        widgetReducerProp={widgetReducerProp}
        widgetConfig={widgetConfig}/>
    );
  }

  render() {
    // First, find all widgets we want to render for this widgetcontainer
    let currentWidgetStates = this.props.widgetState.widgetLocations[this.props.widgetLocationName];
    if (currentWidgetStates) {
      // Loop over the widgets, you can have as many as you'd like
      const widgets = (Array.isArray(currentWidgetStates) ? currentWidgetStates : [currentWidgetStates]).map((currentWidgetState, idx) => {
        // Get widgetConfig
        const widgetConfig = currentWidgetState.widgetConfig;

        // Now we get the widget we wish to render.
        const widgetName = currentWidgetState.widgetName;

        // Get the component
        const CurrentWidget = this.getComponent(widgetConfig, widgetName);

        // Get a generic title
        const title = this.getTitle(widgetConfig, widgetName);

        // Get generic background image/style
        const widgetStyles = this.getStyles(widgetConfig);

        // We now render our widget inside a container
        return (
          <div
            className={`generic-widget-container ${widgetName}--container`}
            key={`${this.props.widgetLocationName}_${widgetName}_${idx}`}
          >
            {title}
            <div
              className={`${widgetName}--wrapper`}
              style={widgetStyles}
            >
              {CurrentWidget}
            </div>
          </div>
        );
      });

      // Finally we render the array of widgets relevant to this position.
      return (
        <div className={`${this.props.widgetLocationName}--generic-widget-container`}>
          {widgets}
        </div>
      );
    }

    // This renders if no widgets were found for this position
    return <span className={`${this.props.widgetLocationName}--generic-widget-container no-widgets`}/>;
  }
}

WidgetContainer.displayName = 'WidgetContainer';
WidgetContainer.propTypes = {
  widgetLocationName: PropTypes.string.isRequired,
  widgetState: PropTypes.object.isRequired,
  widgetActions: PropTypes.object.isRequired
};

export default WidgetContainer;
