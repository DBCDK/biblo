'use strict';

import React from 'react';
import PageLayout from '../Layout/PageLayout.component.js';
import './_frontpage.scss';

export default function FrontpageContainer() {
  const loginLink = !window || !window.USER_IS_LOGGED_IN ? <a href="/login" >Log ind</a> :
    <a href="/logout" >Log ud</a>;
  return (
    <PageLayout>
      <h1>Biblo</h1>

      <p>Content area...</p>
      {loginLink}
    </PageLayout>
  );
}

FrontpageContainer.displayName = 'FrontpageContainer';
