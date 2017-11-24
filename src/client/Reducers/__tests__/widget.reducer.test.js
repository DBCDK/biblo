import WidgetReducer from '../widget.reducer';
import {action, actionExpected} from './mocks/widget.reducer.mocks';
import {expect} from 'chai';

describe('Testing widget.reducer', () => {
  it('Should key works in EditoriallySelectedMaterialsWidget by string of pids', () => {
    const initialState = {
      EditoriallySelectedMaterialsWidget: {
        works: {}
      }
    };

    const result = WidgetReducer(initialState, action);
    expect(JSON.stringify(result)).to.equal(JSON.stringify(actionExpected));
  });
});
