import axios from 'axios';
import _ from 'lodash';
import queryString from 'query-string';
import Config from 'react-native-config';

export const SERVER = Config.SERVER_URL;

const decideRequest = (prom, resolve, reject) =>
  prom
    .then(res =>
      (_.get(res, 'status') === 200
        ? resolve(_.get(res, 'data', {}))
        : reject(_.get(res, 'data', res))))
    .catch(err => reject(err));

const addJsonParams = (url, data) => {
  if (_.isEmpty(data)) {
    return url;
  }
  return _.join(
    [
      url,
      queryString.stringify(data)
    ],
    _.indexOf(url, '?') === -1 ? '?' : '&'
  );
};

export const Network = ({
  method, url, headers, baseURL, data
}) => {
  if (!method || method == 'GET') {
    data = data || {};
    url = addJsonParams(url, data);
  }

  return new axios({
    method: method || 'GET',
    baseURL: baseURL || SERVER,
    url,
    data,
    headers: _.extend(
      {
        'app-version': '1.0.0'
      },
      headers
    )
  });
};

export default (params) => new Promise(
  (resolve, reject) => decideRequest(Network(params), resolve, reject)
);
