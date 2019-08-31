import _ from 'lodash';
import Network from '../utils/Network';
import Config from 'react-native-config';

const request = params => Network(_.extend({}, params, {
  baseURL: 'https://maps.googleapis.com/maps/api',
  method: 'GET',
  data: _.extend({}, _.get(params, 'data'), {
    key: Config.GOOGLE_MAPS_API_KEY
  })
}));

export const findPlaces = ({ input }) => request({
  url: 'place/autocomplete/json',
  data: { input }
});

export const getPlace = ({ place_id }) => request({
  url: 'place/details/json',
  data: { placeid: place_id, fields: 'geometry' }
});
