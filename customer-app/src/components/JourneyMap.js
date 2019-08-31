import React from 'react'
import UnitMap from '../components/UnitMap';
import _ from 'lodash';
// import console = require('console');

const JourneyMap = ({journey, style}) => {
  const params = {
    entities: _.map(journey, ({entity}) => entity),
    routes: _.map(journey, ({route, entity}) => [route,entity.type]),
    times: _.map(journey, ({time}) => time),
    style,
  };
  console.log(params);
  return (<UnitMap {...params} />)
}

export default JourneyMap;
