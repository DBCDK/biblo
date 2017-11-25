import {expect} from 'chai';
import {renderWidgetWithEnzyme} from './widgetTest.utils';

// import mocks
import {fivePidState} from '../__mocks__/SelectedMaterials.mock';

describe('Testing of the editorially selected reviews widget', () => {
  it('should render widget', () => {
    const $root = renderWidgetWithEnzyme({
      location: 'test-editorially-selected-materials-location',
      widgetName: 'EditoriallySelectedMaterialsWidget',
      widgetConfig: fivePidState.widgetConfig,
      state: {
        EditoriallySelectedMaterialsWidget: fivePidState.widgetReducerProp
      }
    });

    expect($root.find('.editorially-selected-materials-widget').length).to.equal(1);
  });
});
