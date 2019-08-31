import _ from 'lodash';
import { findPlaces, getPlace } from '../utils/Maps';
import { fetchJourneys } from './Journey';

export const setLocation = ({ latitude, longitude }) => (dispatch) => {
  console.log('latitude is', latitude);
  console.log('longitude is', longitude);
};

export const loadPlaces = ({ input }) => (dispatch) => {
  findPlaces({ input })
    .then(places => dispatch({
      type: "LOCATIONS_RECEIVED",
      payload: places
    }))
    .catch(err => console.log('get places error is', err));
};

export const selectPlace = (place, reason) => (dispatch, getState) => {
  const { description } = place;
  const locations = getState().locations;
  getPlace(place)
    .then(({result}) => {
      const coordinates = _.get(result, 'geometry.location', {});
      dispatch({
        type: 'LOCATION_SELECTED',
        payload: { coordinates, description, reason }
      });
      let fromLat = 0;
      let fromLng = 0;
      let fromDescription = '';
      let toLat = 0;
      let toLng = 0;
      let toDescription = '';
      let transition = false;
      if (reason == 'from' && !_.isEmpty(locations.getIn(['selected', 'to']))) {
        transition = true;
        fromLat = coordinates.lat;
        fromLng = coordinates.lng;
        fromDescription = description;
        toLat = locations.getIn(['selected', 'to', 'coordinates', 'lat']);
        toLng = locations.getIn(['selected', 'to', 'coordinates', 'lng']);
        toDescription = locations.getIn(['selected', 'to', 'description']);
      }
      if (reason == 'to' && !_.isEmpty(locations.getIn(['selected', 'from']))) {
        transition = true;
        toLat = coordinates.lat;
        toLng = coordinates.lng;
        toDescription = description;
        fromLat = locations.getIn(['selected', 'from', 'coordinates', 'lat']);
        fromLng = locations.getIn(['selected', 'from', 'coordinates', 'lng']);
        fromDescription = locations.getIn(['selected', 'from', 'description']);
      }
      if (transition) {
        fetchJourneys({
          fromLat,
          fromLng,
          toLat,
          toLng,
          fromDescription,
          toDescription
        });
        dispatch({
          type: "LOCATION_INITIALIZE",
          payload: {}
        })
      }
    })
    .catch(err => console.log('error is', err));
};
