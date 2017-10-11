import WidgetReducer from '../widget.reducer';
import {action, actionExpected} from './mocks/widget.reducer.mocks';
import expect from 'expect';

describe('Testing widget.reducer', () => {
  it('Should key works in EditoriallySelectedMaterialsWidget by string of pids', () => {
    const initialState = {
      EditoriallySelectedMaterialsWidget: {
        works: {}
      }
    };

    const result = WidgetReducer(initialState, action);
    expect(JSON.stringify(result)).toEqual(JSON.stringify(actionExpected));
  });
});
