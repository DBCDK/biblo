'use strict';

import React from 'react';
import PageLayout from '../Layout/PageLayout.component.js';

import parseJsonData from '../../Utils/parseJsonData.js';

import ColoredHeader from '../General/ColoredHeader/ColoredHeader.component.js';
import ContentGrid from '../General/ContentGrid/ContentGrid.component.js';

import './_frontpage.scss';

const contentItems = parseJsonData('JSONDATA', 'frontpageData');

console.log(contentItems);

export default function FrontpageContainer() {

  const welcomeText = '' +
    'Du kender biblioteket som stedet, hvor du kan lære noget, ' +
    'lege og møde andre børn. Sådan er det også her på Biblo.dk. ' +
    'Her kommer der hele tiden nye grupper, konkurrencer og børn til. ' +
    'Det giver mening at være nysgerrig på Biblo - helt sikkert!';

  return (
    <PageLayout>
      <ColoredHeader text={welcomeText} title={'Velkommen til Biblo'} />
      <ContentGrid items={contentItems} />
    </PageLayout>
  );
}

FrontpageContainer.displayName = 'FrontpageContainer';
