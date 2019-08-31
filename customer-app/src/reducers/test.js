import Immutable from 'immutable';
import { createReducer } from '../utils';

const initialState = Immutable.fromJS({
  name: 'Hello World'
});

const reducers = {
  TEST_RECEIVED: (state, { name }) => state.set('name', name)
};

export default createReducer(initialState, reducers);
