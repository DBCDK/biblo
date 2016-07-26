import React from 'react';

import InputField from '../../General/InputField/InputField.component';
import SearchDropDown from '../../SearchBox/SearchDropDown/SearchDropDown.component.js';
import RoundedButton from '../../General/RoundedButton/RoundedButton.a.component';

import './ProfileLibraryInfo.component.scss';

export class ProfileLibraryInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  getLibraryDescription() {
    if (this.props.favoriteLibrary && this.props.favoriteLibrary.libraryAddress && this.props.favoriteLibrary.libraryName) {
      return (
        <div>
          {this.props.favoriteLibrary.libraryName} <br />
          {this.props.favoriteLibrary.libraryAddress} <br />
          <RoundedButton
            clickFunction={() => this.props.unselectLibraryFunction()}
            buttonText="Klik her for at vælge et andet bibliotek"
            compact={true}
          />
        </div>
      );
    }

    return '';
  }

  getSearchField() {
    if (typeof this.props.favoriteLibrary.libraryName === 'undefined') {
      return (
        <div className="search-area library-search-area" >
          <InputField
            defaultValue={this.props.search}
            error={this.props.errorObj.search}
            onChangeFunc={this.props.searchAction}
            type="text"
            name="search"
            title="Vælg dit bibliotek"
            placeholder="Søg efter dit bibliotek her"
            autocomplete="off"
            disabled={!!(this.props.favoriteLibrary && this.props.favoriteLibrary.libraryName && this.props.favoriteLibrary.libraryAddress)}
            required={!(this.props.favoriteLibrary && this.props.favoriteLibrary.libraryId && this.props.favoriteLibrary.libraryId.length > 0)}
          />

          <SearchDropDown
            visible={this.props.searchElements.length > 0}
            elements={this.props.searchElements}
          />
        </div>
      );
    }

    return null;
  }

  render() {
    const libraryDescription = this.getLibraryDescription();
    const searchField = this.getSearchField();

    return (
      <div className="library--form-area" >
        <h3>Dit bibliotek</h3>
        {this.props.errorObj.library || this.props.errorObj.libraryId || ''}

        <div className="selected-library-description" >
          {libraryDescription}
        </div>

        {searchField}

        <div className='hidden' >
          <input
            type='hidden'
            name='libraryId'
            value={this.props.libraryId}
          />
        </div>

        <InputField
          error={this.props.errorObj.loanerId}
          onChangeFunc={this.props.loanerIdChangeFunc}
          type="text"
          name="loanerId"
          title="Dit lånernummer"
          placeholder="Lånernummer"
          required={this.props.requireAll}
        />

        <InputField
          error={this.props.errorObj.pincode}
          onChangeFunc={this.props.pincodeChangeFunc}
          type="password"
          name="pincode"
          title="Din pinkode"
          placeholder="Pinkode"
          required={this.props.requireAll}
        />
      </div>
    );
  }
}

ProfileLibraryInfo.propTypes = {
  errorObj: React.PropTypes.object,
  favoriteLibrary: React.PropTypes.object.isRequired,
  unselectLibraryFunction: React.PropTypes.func.isRequired,
  search: React.PropTypes.string,
  searchAction: React.PropTypes.func.isRequired,
  searchElements: React.PropTypes.array,
  libraryId: React.PropTypes.string.isRequired,
  loanerIdChangeFunc: React.PropTypes.func.isRequired,
  pincodeChangeFunc: React.PropTypes.func.isRequired,
  requireAll: React.PropTypes.bool
};
