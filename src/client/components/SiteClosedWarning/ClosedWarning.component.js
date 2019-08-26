import React from 'react';

const ClosedWarning = () => (
  <span>
    Du har ramt Biblo udenfor vores åbningstider.{' '}
    <a href="/aaben" style={{color: 'white', textDecoration: 'underline'}}>
      Se dem her
    </a>
  </span>
);

ClosedWarning.displayName = 'ClosedWarning';

export default ClosedWarning;
