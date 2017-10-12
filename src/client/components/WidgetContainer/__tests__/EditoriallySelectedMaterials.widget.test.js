import expect from 'expect';
import {renderWidgetWithTeaspoon} from './widgetTest.utils';

// import mocks
import {fivePidState} from '../__mocks__/SelectedMaterials.mock';

describe('Testing of the editorially selected reviews widget', () => {
  it('should render widget', () => {
    const $root = renderWidgetWithTeaspoon({
      location: 'test-editorially-selected-materials-location',
      widgetName: 'EditoriallySelectedMaterialsWidget',
      widgetConfig: fivePidState.widgetConfig,
      state: {
        EditoriallySelectedMaterialsWidget: fivePidState.widgetReducerProp
      }
    });

    expect($root.find('.editorially-selected-materials-widget').length).toEqual(1);
  });
});