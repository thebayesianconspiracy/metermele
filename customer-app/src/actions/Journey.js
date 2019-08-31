import _ from 'lodash';

import { getRoutes, createBid } from '../utils/Routing';
import Store from '../utils/Store';

const time = 1556460882000;

function distance(lat1, lon1, lat2, lon2) {
  if ((lat1 == lat2) && (lon1 == lon2)) {
    return 0;
  }
  else {
    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344
    return dist;
  }
}


function distanceToFare(distance, entityType){
  if(entityType=='PERSON'){
    return 0;
  }
  else if(entityType=='BUS'){
    return distance*3;
  }
  else if(entityType=='AUTO'){
    return Math.max(distance*10,15);  
  }
}


function distanceToTime(distance, entityType){
  const speedMap = {
    PERSON: 5,
    BUS: 25,
    AUTO: 30
  }
  const constTimeMap = {
    PERSON: 0,
    BUS: 3,
    AUTO: 5
  }
  const speed = speedMap[entityType] || 5;
  const constTime = constTimeMap[entityType] || 5;
  return ((distance*60)/speed)+constTime;
}


const templates = [
  "Comfort optimized",
  "Time optimized",
  "Fare optimized"
];

export const fetchJourneys = ({
  fromLat,
  fromLng,
  fromDescription,
  toLat,
  toLng,
  toDescription
}) => {
  getRoutes({
    fromLat,
    fromLng,
    toLat,
    toLng
  }).then(res => {
    const journeys = _.chain(res)
                      .get("journeys", [])
                      .map(({
                        Segments,
                        Vehicles
                      }, index) => {
                        const segmentRoutes = _.chain(Segments)
                                               .map(({FromStop}) => _.get(FromStop, "LineRef"))
                                               .uniq()
                                               .value();
                        const groupedSegments = _.groupBy(Segments, "FromStop.LineRef");
                        const busJourney = _.map(segmentRoutes, (segmentRoute) => {
                          const segments = groupedSegments[segmentRoute];
                          const route = _.chain(
                            segments
                          ).map(({
                            FromStop,
                            ToStop
                          }) => ([{
                            latitude: _.get(FromStop, "Location.Latitude"),
                            longitude: _.get(FromStop, "Location.Longitude"),
                          }, {
                            latitude: _.get(ToStop, "Location.Latitude"),
                            longitude: _.get(ToStop, "Location.Longitude"),
                          }])).flatten().value()
                          const fromStop = _.chain(segments).first().get("FromStop.StopPointName").value();
                          const toStop = _.chain(segments).last().get("ToStop.StopPointName").value();
                          const totalDistance = _.chain(segments).map(({RoutePath}) => _.get(RoutePath, "distance", 0)).sum().value()/1000;
                          const entity = {
                            type: "BUS",
                            coordinate: _.sample(route),
                            fromStop: fromStop,
                            toStop: toStop,
                            occupancy: "NONE",
                            distance: totalDistance,
                            fare: distanceToFare(totalDistance, "BUS"),
                            time: distanceToTime(totalDistance, "BUS")
                          }
                          const time = {
                            coordinate: _.last(route),
                            time: new Date()
                          }
                          return {
                            route,
                            entity,
                            time
                          }
                        });
                        const firstRoute = _.first(busJourney).route;
                        const firstJourneyStart = {
                          latitude: fromLat,
                          longitude: fromLng
                        };
                        const firstJourneyEnd = _.first(firstRoute);
                        const lastRoute = _.last(busJourney).route;
                        const lastJourneyStart = _.last(lastRoute);
                        const lastJourneyEnd = {
                          latitude: toLat,
                          longitude: toLng
                        };
                        const firstJourneyFirstStop = fromDescription;
                        const firstJourneyLastStop = _.chain(busJourney).first().get('entity.fromStop').value();
                        const autoKm = Store.getState().appState.get('maxWalkingValue');
                        const firstStopDistance = distance(
                          firstJourneyStart.latitude,
                          firstJourneyStart.longitude,
                          firstJourneyEnd.latitude,
                          firstJourneyEnd.longitude,
                        );
                        const firstEntityType = firstStopDistance > autoKm ? "AUTO" : "PERSON";
                        const firstJourney = {
                          entity: {
                            coordinate: firstJourneyStart,
                            type: firstEntityType,
                            fromStop: firstJourneyFirstStop,
                            toStop: firstJourneyLastStop,
                            occupancy: "NONE",
                            distance: firstStopDistance,
                            fare: distanceToFare(firstStopDistance, firstEntityType),
                            time: distanceToTime(firstStopDistance, firstEntityType)
                          },
                          route: [firstJourneyStart, firstJourneyEnd],
                          time: {
                            coordinate: firstJourneyEnd,
                            time: new Date()
                          }
                        };
                        const lastStopDistance = distance(
                          lastJourneyStart.latitude,
                          lastJourneyStart.longitude,
                          lastJourneyEnd.latitude,
                          lastJourneyEnd.longitude,
                        );
                        const lastJourneyFirstStop = _.chain(busJourney).last().get('entity.toStop').value();
                        const lastJourneyLastStop = toDescription;
                        const lastEntityType = lastStopDistance > autoKm ? "AUTO" : "PERSON";
                        const lastJourney = {
                          entity: {
                            coordinate: lastJourneyStart,
                            type: lastEntityType,
                            fromStop: lastJourneyFirstStop,
                            toStop: lastJourneyLastStop,
                            occupancy: "NONE",
                            distance: lastStopDistance,
                            fare: distanceToFare(lastStopDistance, lastEntityType),
                            time: distanceToTime(lastStopDistance, lastEntityType)
                          },
                          route: [lastJourneyStart, lastJourneyEnd],
                          time: {
                            coordinate: lastJourneyEnd,
                            time: new Date()
                          }
                        };
                        const journey = _.concat(firstJourney, busJourney, lastJourney);
                        return {
                          journey,
                          title: templates[index]
                        };
                      }).value();
    Store.dispatch({
      type: "JOURNEY_INITIALIZE",
      payload: { journeys }
    })
    console.log("Routes are", journeys);
  }).catch(err => {
    console.log("Error is", err);
  });
}

export const bookAuto = (dispatch, getState) => {
  const appState = getState().appState;
  const metermele = _.parseInt(appState.get('meterMeleAmount'))

  const currentJourney = appState.get('currentJourney');
  const currentLeg = appState.get('currentLeg');
  const journey = getState().journey.getIn(['journeys', currentJourney, 'journey', currentLeg]).toJS();
  console.log("Journey is", journey);
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
