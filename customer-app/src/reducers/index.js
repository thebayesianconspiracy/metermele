import { combineReducers } from 'redux';

import test from './test';
import locations from './locations';
import journey from './journey';
import appState from './appState';

export default combineReducers({
  test,
  journey,
  appState,
  locations
});
