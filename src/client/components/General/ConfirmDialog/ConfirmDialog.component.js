import React from 'react';

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
  cancelFunc: React.PropTypes.func.isRequired,
  confirmFunc: React.PropTypes.func.isRequired,
  cancelButtonText: React.PropTypes.string.isRequired,
  confirmButtonText: React.PropTypes.string.isRequired,
  children: React.PropTypes.any.isRequired
};

export default ConfirmDialog;
