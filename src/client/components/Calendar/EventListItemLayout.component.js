'use strict';

/**
 * @file
 * Shows a newsitem i list form layout
 *
 * @usage
 * <EventListItemLayout {...data} />
 *
 */

import React from 'react';

export default class EventListItemLayout extends React.Component {
  render() {
    return (
      <div className={`news-item clearfix ${this.props.zebra}`} >
        <a className="" href={`${this.props.link}`} >
          <div className="headline" >{this.props.title}</div>
          <div className="image" >
            {this.props.image &&
            <img alt={this.props.title} className='news-item-image' src={`http://rest.filmstriben.dbc.inlead.dk/web/${this.props.image}`} />
            }
          </div>
          <div className="lead" >
            {this.props.lead}
          </div>
          <span className="link" >Læs mere</span>
        </a>
      </div>
    );
  }
}

EventListItemLayout.displayName = 'EventItem';
EventListItemLayout.propTypes = {
  body: React.PropTypes.string.isRequired,
  image: React.PropTypes.string,
  lead: React.PropTypes.string.isRequired,
  link: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired,
  zebra: React.PropTypes.string.isRequired
};
