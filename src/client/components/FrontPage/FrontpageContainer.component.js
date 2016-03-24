'use strict';

import React from 'react';
import PageLayout from '../Layout/PageLayout.component.js';

import parseJsonData from '../../Utils/parseJsonData.js';

import ColoredHeader from '../General/ColoredHeader/ColoredHeader.component.js';
import ContentGrid from '../General/ContentGrid/ContentGrid.component.js';

import './_frontpage.scss';

const content = parseJsonData('JSONDATA', 'frontpageData');

export default function FrontpageContainer() {

  const welcomeText = content.welcome_text;

  const elements = content.elements;

  return (
    <PageLayout>
      <ColoredHeader text={welcomeText} title={content.welcome_header} />
      <ContentGrid items={elements} />
    </PageLayout>
  );
}

FrontpageContainer.displayName = 'FrontpageContainer';
