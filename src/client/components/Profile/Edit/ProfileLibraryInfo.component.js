import React from 'react';

import InputField from '../../General/InputField/InputField.component';
import SearchDropDown from '../../SearchBox/SearchDropDown/SearchDropDown.component.js';
import RoundedButton from '../../General/RoundedButton/RoundedButton.a.component';

import './ProfileLibraryInfo.component.scss';

export default function ProfileLibraryInfo({
  errorObj, favoriteLibrary, unselectLibraryFunction, search, searchAction, searchElements, libraryId, loanerIdChangeFunc, pincodeChangeFunc, requireAll
}) {
  let libraryDescription = '';

  if (favoriteLibrary && favoriteLibrary.libraryAddress && favoriteLibrary.libraryName) {
    libraryDescription = (
      <div>
        {favoriteLibrary.libraryName} <br />
        {favoriteLibrary.libraryAddress} <br />
        <RoundedButton clickFunction={() => unselectLibraryFunction()}
                       buttonText="Klik her for at vælge et andet bibliotek" compact={true} />
      </div>
    );
  }

  let searchField = null;
  if (typeof favoriteLibrary.libraryName === 'undefined') {
    searchField = (
      <div className="search-area library-search-area">
        <InputField
          defaultValue={search}
          error={errorObj.search}
          onChangeFunc={searchAction}
          type="text"
          name="search"
          title="Vælg dit bibliotek"
          placeholder="Søg efter dit bibliotek her"
          autocomplete="off"
          disabled={!!(favoriteLibrary && favoriteLibrary.libraryName && favoriteLibrary.libraryAddress)}
          required={!(favoriteLibrary && favoriteLibrary.libraryId && favoriteLibrary.libraryId.length > 0)}
        />
        <SearchDropDown visible={searchElements.length > 0} elements={searchElements} />
      </div>
    );
  }

  return (
    <div className="library--form-area" >
      <h3>Dit bibliotek</h3>
      {errorObj.library || ''}

      <div className="selected-library-description" >
        {libraryDescription}
      </div>

      {searchField}

      <div className='hidden' >
        <input
          type='hidden'
          name='libraryId'
          value={libraryId}
        />
      </div>

      <InputField
        error={errorObj.loanerId}
        onChangeFunc={loanerIdChangeFunc}
        type="text"
        name="loanerId"
        title="Dit lånernummer"
        placeholder="Lånernummer"
        required={requireAll}
      />

      <InputField
        error={errorObj.pincode}
        onChangeFunc={pincodeChangeFunc}
        type="text"
        name="pincode"
        title="Din pinkode"
        placeholder="Pinkode"
        required={requireAll}
      />
    </div>
  );
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
