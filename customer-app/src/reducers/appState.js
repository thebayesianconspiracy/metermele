import Immutable from 'immutable';
import { createReducer } from '../utils';

const initialState = Immutable.fromJS({
  currentJourneyBrowse: 0,
  currentJourney: null,
  maxLegs: null,
  currentLeg: 0,
  activeScreen:'LOCATION_SELECT',

  maxWalkingValue: 0.2,
  autoBookAuto: true,
  busPref: {
    AC: true,
    EXPRESS: true,
    LOCAL: true,
  },
  userLocation: {
    latitude: 23.0120338,
    longitude: 72.51075399999999,
  },
  meterMeleAmount: '25'
});

const reducers = {
  APPSTATE_UPDATE_BROWSE: (state, { currentJourneyBrowse }) => state.setIn(['currentJourneyBrowse'], currentJourneyBrowse),
  APPSTATE_UPDATE_CURRENT_JOURNEY: (state, { currentJourney }) => state.setIn(['currentJourney'], currentJourney),
  APPSTATE_UPDATE_CURRENT_LEG: (state, { currentLeg }) => state.setIn(['currentLeg'], currentLeg),
  APPSTATE_UPDATE_MAX_LEGS: (state, { maxLegs }) => state.setIn(['maxLegs'], maxLegs),

  APPSTATE_UPDATE_MAX_WALKING: (state, { maxWalkingValue }) => state.setIn(['maxWalkingValue'], maxWalkingValue),
  APPSTATE_UPDATE_BUS_PREF_AC: (state, {acPref}) => state.setIn(['busPref','AC'], acPref),
  APPSTATE_UPDATE_BUS_PREF_EXPRESS: (state, { expressPref }) => state.setIn(['busPref','EXPRESS'], expressPref),
  APPSTATE_UPDATE_BUS_PREF_LOCAL: (state, { localPref }) => state.setIn(['busPref','LOCAL'], localPref),
  APPSTATE_UPDATE_METER_MELE: (state, { meterMele }) => state.setIn(['meterMeleAmount'], meterMele),
  APPSTATE_UPDATE_AUTO_BOOK: (state, { autoBookAuto }) => state.setIn(['autoBookAuto'], autoBookAuto),
  APPSTATE_UPDATE_ACTIVE_SCREEN: (state, { activeScreen }) => {
    if(activeScreen=='JOURNEY_CHOOSE'){
      state = state.setIn(['currentJourneyBrowse'],0).setIn(['currentJourney'], null).setIn(['maxLegs'], null).setIn(['currentLeg'], 0);  
    }
    return state.setIn(['activeScreen'], activeScreen)
  },
  APPSTATE_UPDATE_USER_LOCATION: (state, { userLocation }) => state.setIn(['userLocation'], Immutable.fromJS(userLocation))
};

export default createReducer(initialState, reducers);
