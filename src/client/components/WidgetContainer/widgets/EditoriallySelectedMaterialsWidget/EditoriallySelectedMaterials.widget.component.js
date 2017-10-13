/**
 * @file: implements EditoriallySelectedMaterialsWidget, renders pre selected materials from widgetConfig.
 */

/* eslint-disable react/no-danger */

import React from 'react';
import {isEqual} from 'lodash';

import {AbstractWidget} from '../../AbstractWidget.component';
import Icon from '../../../General/Icon/Icon.component';
import plusSvg from '../../../General/Icon/svg/functions/plus.svg';
import minusSvg from '../../../General/Icon/svg/functions/minus.svg';

import {CompactWorkElementsContainer} from '../BestRatedWorksWidget/compactWorkElementsContainer.component';

import './scss/EditoriallySelectedMaterials.widget.component.scss';

export class EditoriallySelectedMaterialsWidget extends AbstractWidget {
  constructor(props) {
    super(props);

    this.state = {
      closed: true,
      identifier: Array.isArray(props.widgetConfig.pids) ? props.widgetConfig.pids.join() : null,
      works: Object.values(props.widgetReducerProp.works),
      isLoading: true
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.state, nextState) ||
      !isEqual(nextProps.widgetReducerProp, this.props.widgetReducerProp) ||
      !isEqual(nextProps.widgetConfig, this.props.widgetConfig);
  }

  componentWillReceiveProps(nextProps) {
    const works = nextProps.widgetReducerProp.works[this.state.identifier] ?
      Object.values(nextProps.widgetReducerProp.works[this.state.identifier]) :
      [];
    this.setState({works, isLoading: false});

    const identifier = Array.isArray(this.props.widgetConfig.pids) ? this.props.widgetConfig.pids.join() : null;
    if (this.state.identifier !== identifier) {
      this.setState({identifier: identifier});
    }
  }

  componentDidMount() {
    this.callServiceProvider('work', {pids: this.props.widgetConfig.pids});
  }

  getShowMoreButton(svg, label) {
    return (
      <a className="editorially-selected-materials-widget--show-more-button" onClick={() => this.setState({closed: !this.state.closed})}>
        <span>
          <Icon glyph={svg} /> {label}
        </span>
      </a>
    );
  }

  render() {
    const works = (this.props.widgetReducerProp.works[this.state.identifier] || []).slice(0, this.state.closed ?
      6 :
      (this.state.works.length));

    let closeButtonContent = null;
    if (works.length >= 6 && !this.state.isLoading) {
      const svg = this.state.closed ? plusSvg : minusSvg;
      const label = this.state.closed ? 'VIS FLERE' : 'VIS FÆRRE';
      closeButtonContent = this.getShowMoreButton(svg, label);
    }

    return (
      <div className="editorially-selected-materials-widget">
        <CompactWorkElementsContainer
          closed={this.state.closed}
          isLoading={this.state.isLoading}
          works={works} />

        <div className="editorially-selected-materials-widget--show-more-button--container">
          {closeButtonContent}
        </div>

      </div>
    );
  }
}

EditoriallySelectedMaterialsWidget.displayName = 'EditoriallySelectedMaterialsWidget';
