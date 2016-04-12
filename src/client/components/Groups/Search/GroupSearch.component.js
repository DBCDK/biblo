import React from 'react';

export default class GroupSearch extends React.Component {
  render() {
    return (
      <form>
        <input placeholder="Søg blandt grupper her" />
        <input type="submit" value="Søg!"/>
      </form>
    );
  }
}

GroupSearch.displayName = 'GroupSearch';
