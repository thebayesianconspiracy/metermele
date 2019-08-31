import _ from 'lodash';
import {getBid} from './Routing';
import Store from './Store';
import { getRoutes, createBid } from './Routing';

const bookNextAuto = (dispatch, getState) => {
  const appState = getState().appState;
  const metermele = _.parseInt(appState.get('meterMeleAmount'))

  const currentJourney = appState.get('currentJourney');
  const currentLeg = appState.get('currentLeg') + 1;
  const journey = getState().journey.getIn(['journeys', currentJourney, 'journey', currentLeg]).toJS();
  createBid({
    user_id: 1,
    metermele,
    fromLat: _.get(journey, ['route', 0, 'latitude']),
    fromLng: _.get(journey, ['route', 0, 'longitude']),
    from_address: _.get(journey, 'entity.fromStop'),
    toLat: _.chain(journey).get('route').last().get('latitude').value(),
    toLng: _.chain(journey).get('route').last().get('longitude').value(),
    to_address: _.get(journey, 'entity.toStop'),
  }).then(res => {
    console.log("Responses is", res);
    dispatch({
      type: "JOURNEY_SET_AUTO_BID",
      payload: {
        journey: currentJourney,
        leg: currentLeg,
        otp: res.otp,
        bid_id: res.id
      }
    })
  })
}


export const listenToServer = () => {
  const startTime = Date.now();
  const id = Store.getState().locations.get("id");
  const next = (pollTime) => {
    setTimeout(listenToServer, pollTime || Math.max(1000 - Date.now() + startTime, 0));
  };
  const state = Store.getState();
  const appState = state.appState;

  const currentJourney = appState.get('currentJourney');
  const currentLeg = appState.get('currentLeg');
  const entityObj = state.journey.getIn(['journeys', currentJourney, 'journey', currentLeg, 'entity']);
  if (_.isEmpty(entityObj)) {
    return next();
  }
  const entity = entityObj.toJS();
  if (!entity.bidMade) {
    return next();
  }
  getBid({ id: entity.bid_id }).then(bid => {
    if (bid.driver_id) {
      Store.dispatch({
        type: "JOURNEY_SET_AUTO_ACCEPTED",
        payload: {
          journey: currentJourney,
          leg: currentLeg,
          driver_id: bid.driver_id
        }
      })
      return next(5000); 
    }
    return next();
  }).catch(err => {
    console.log("error while fetching bid is", err);
    return next();
  });
};

setTimeout(() => {
  listenToServer();
}, 2000);

// update user location

export const updateUserLocation = () => {
  let nextTime = 1000;
  const startTime = Date.now();
  const id = Store.getState().locations.get("id");
  const next = (pollTime) => {
    setTimeout(updateUserLocation, pollTime || Math.max(1000 - Date.now() + startTime, 0));
  };
  const state = Store.getState();
  const appState = state.appState;

  const currentJourney = appState.get('currentJourney');
  const currentLeg = appState.get('currentLeg');
  const routeObj = state.journey.getIn(['journeys', currentJourney, 'journey', currentLeg, 'route']);
  if (_.isEmpty(routeObj)) {
    return next();
  }
  const entityObj = state.journey.getIn(['journeys', currentJourney, 'journey', currentLeg, 'entity']);
  if (_.isEmpty(entityObj)) {
    return next();
  }
  const entity = entityObj.toJS();
  if (entity.type === 'AUTO') {
    if (_.isUndefined(entity.vehicleNo)) {
      return next();
    }
  }
  const routes = routeObj.toJS();
  let userLocation = appState.get('userLocation').toJS();
  if (_.isUndefined(userLocation.index)) {
    userLocation.index = 0;
  }
  if (userLocation.index === 0) {
    nextTime = 10000;
  }

  // Prebooking
  const nextEntityObj = state.journey.getIn(['journeys', currentJourney, 'journey', currentLeg+1, 'entity']);
  if (!_.isEmpty(nextEntityObj)) {
    const nextEntity = nextEntityObj.toJS();
    if (nextEntity.type === 'AUTO' && !nextEntity.bidMade && userLocation.index >= routes.length - 2) {
      Store.dispatch(bookNextAuto);
    }
  }

  
  if (userLocation.index >= routes.length) {
    userLocation.index = 0;
    let legId = currentLeg;
    const maxLegs = appState.get('maxLegs');
    if (legId == maxLegs) {
      legId = null;
      Store.dispatch({
        type: 'APPSTATE_UPDATE_ACTIVE_SCREEN',
        payload: {
          activeScreen: 'JOURNEY_END'
        }
      });
    }
    else {
      legId = legId + 1;
    }
    Store.dispatch({
      type: 'APPSTATE_UPDATE_CURRENT_LEG',
      payload: {
        currentLeg: legId
      }
    })
  } else {
    userLocation = _.extend(
      {
        index: userLocation.index + 1
      },
      routes[userLocation.index]
    );
  };
  Store.dispatch({
    type: 'APPSTATE_UPDATE_USER_LOCATION',
    payload: {
      userLocation
    }
  })
  Store.dispatch({
    type: 'JOURNEY_SET_ENTITY_LOCATION',
    payload: {
      journey: currentJourney,
      leg: currentLeg,
      coordinate: userLocation
    }
  })
  return next(nextTime);
};

setTimeout(() => {
  updateUserLocation();
}, 2000);
