'use strict';

import React from 'react';
import PageLayout from '../Layout/PageLayout.component.js';
import './_frontpage.scss';

export default function FrontpageContainer() {
  return (
    <PageLayout>
      <h1>Biblo</h1>
      <p>Content area...</p>
    </PageLayout>
  );
}

FrontpageContainer.displayName = 'FrontpageContainer';
