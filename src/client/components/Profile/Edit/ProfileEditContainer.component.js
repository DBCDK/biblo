'use strict';

import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import * as ProfileActions from '../../../Actions/profile.actions';

export default class ProfileEditContainer extends React.Component {
  render() {
    return (
      <div>
        <h1 className="profile-edit--title">Redigér Profil</h1>
        <form method="post" encType="multipart/form-data">
          <div>
            <label>
              <img src={this.props.profile.image.url.medium} />
              <p><strong>Upload et profilebillede her!</strong></p>
              <input type="file" name="profile_image" />
            </label>
          </div>
          <div>
            <label>
              <p><strong>Vælg et brugernavn</strong></p>
              <input required name="displayname" placeholder="Dit brugernavn" defaultValue={this.props.profile.displayName} />
            </label>
          </div>
          <div>
            <label>
              <p><strong>Beskriv dig selv</strong></p>
              <textarea placeholder="Her kan du skrive lidt om dig selv" name="description" defaultValue={this.props.profile.description} />
            </label>
          </div>
          <div>
            <label>
              <p><strong>E-mail (din eller dine forældres)</strong></p>
              <input type="email" name="email" placeholder="E-mail" defaultValue={this.props.profile.email} />
            </label>
          </div>
          <div>
            <label>
              <p><strong>Mobil (din eller dine forældres)</strong></p>
              <input type="tel" placeholder="Mobil" name="phone" defaultValue={this.props.profile.phone} />
            </label>
          </div>
          <div>
            <h3>Dit bibliotek</h3>
            <div>
              <label>
                <p><strong>Bibliotek søger</strong></p>
                <input required />
              </label>
            </div>

            <div className='hidden'>
              <input type='hidden' name='libraryId' defaultValue={(this.props.profile.favoriteLibrary || {}).libraryId || '100451'} />
            </div>

            <div>
              <label>
                <p><strong>Lånernummer</strong></p>
                <input type="number" name="loanerId" />
              </label>
            </div>
            <div>
              <label>
                <p><strong>Pinkode</strong></p>
                <input type="number" name="pincode" />
              </label>
            </div>
          </div>
          <div>
            <input type="submit" value="OK" />
          </div>
        </form>
        <a>Klik her hvis det driller</a>
      </div>
    );
  }
}

ProfileEditContainer.displayName = 'ProfileEditContainer';
ProfileEditContainer.propTypes = {
  profile: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object.isRequired
};

/**
 * Connect the redux state and actions to container props
 */
export default connect(
  // Map redux state to group prop
  (state) => {
    return {
      profile: state.profileReducer
    };
  },

  // Map group actions to actions props
  (dispatch) => {
    return {
      actions: bindActionCreators(ProfileActions, dispatch)
    };
  }
)(ProfileEditContainer);
