import React from 'react';

import './TagList.component.scss';

export class TagList extends React.Component {
  render() {
    const tagElements = this.props.tags.map((tag) => (<li>{tag}</li>));
    return (
      <ul className='tag-list'>
        {tagElements}
      </ul>
    );
  }
}

TagList.displayName = 'TagList';
TagList.propTypes = {
  tags: React.PropTypes.array.isRequired
};
