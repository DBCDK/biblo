import React from 'react';
import PropTypes from 'prop-types';

import './confirm-dialog.scss';

function ConfirmDialog({cancelFunc=() => {}, confirmFunc=()=>{}, children='...', cancelButtonText='', confirmButtonText=''}) {
  return (
    <div>
      <div className='confirm-dialog--content'>
        {children}
      </div>
      <div className='confirm-dialog--button-group'>
        <a className='confirm-dialog--button confirm' onClick={confirmFunc}>{confirmButtonText}</a>
        <a className='confirm-dialog--button cancel' onClick={cancelFunc}>{cancelButtonText}</a>
      </div>
    </div>
  );
}

ConfirmDialog.displayName = 'ConfirmDialog';

ConfirmDialog.propTypes = {
  cancelFunc: PropTypes.func.isRequired,
  confirmFunc: PropTypes.func.isRequired,
  cancelButtonText: PropTypes.string.isRequired,
  confirmButtonText: PropTypes.string.isRequired,
  children: PropTypes.any.isRequired
};

export default ConfirmDialog;
