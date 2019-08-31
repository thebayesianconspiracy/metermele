package services

import (
	"sort"

	"github.com/dhconnelly/rtreego"
)

type RouteSegment struct {
	FromStop  Stop
	ToStop    Stop
	RoutePath RoutePath
}

type RouteJourney struct {
	Segments            []RouteSegment
	TotalDistance       float64
	OverallComfortLevel float64
	Vehicles            []VehicleTime
	TotalTime           int
}

const MAX_STOPS = 10
const MAX_JOURNEYS = 50

type TimeGetter func() int

type Routing struct {
	deps RouteDependency
	GetTime TimeGetter
}

func CreateRouter(GetTime TimeGetter) Routing{
	return Routing{
		deps: LoadRouteDependencies(),
		GetTime: GetTime,
	}
}

func (r Routing) GetNearestStops(lat, lng float64) []Stop {
	point := rtreego.Point{lat, lng}
	results := r.deps.rTree.NearestNeighbors(MAX_STOPS, point)
	var stops []Stop
	cache := make(map[string]bool)
	for _, result := range results {
		stop := r.deps.pointsMap[result.Bounds().String()].stop
		_, ok := cache[stop.Name]
		if !ok {
			cache[stop.Name] = true
			stops = append(stops, stop)
		}
	}
	sort.Slice(stops, func(i, j int) bool {
		dis1 := stops[i].GetDistance(point[0], point[1])
		dis2 := stops[j].GetDistance(point[0], point[1])
		return dis1 < dis2
	})
	return stops
}

func (r Routing) GetDoubleRouteWholeSigment(fromStop, toStop Stop) [][]RouteSegment {
	routeSegments := [][]RouteSegment{}
	fromStopNeighborsMap, ok := r.deps.toRouteMap[fromStop.Name]
	if !ok {
		return routeSegments
	}
	toStopNeighborsMap, ok := r.deps.fromRouteMap[toStop.Name]
	if !ok {
		return routeSegments
	}
	for fromStopNeighborName, fromPaths := range fromStopNeighborsMap {
		toPaths, ok := toStopNeighborsMap[fromStopNeighborName]
		if !ok {
			continue
		}
		fromStopNeighbor, ok := r.deps.stopMap[fromStopNeighborName]
		if !ok {
			continue
		}
		for _, fromPath := range fromPaths {
			for _, toPath := range toPaths {
				if fromPath.RouteCode == toPath.RouteCode {
					continue
				}
				routeSegments = append(routeSegments, []RouteSegment{
					RouteSegment{
						FromStop:  fromStop,
						ToStop:    fromStopNeighbor,
						RoutePath: fromPath,
					},
					RouteSegment{
						FromStop:  fromStopNeighbor,
						ToStop:    toStop,
						RoutePath: toPath,
					},
				})
			}
		}
	}
	return routeSegments
}

func (r Routing) GetSingleRouteWholeSigment(fromStop, toStop Stop) []RouteSegment {
	var routeSegments []RouteSegment
	neighborsMap, ok := r.deps.toRouteMap[fromStop.Name]
	if !ok {
		return routeSegments
	}
	paths, ok := neighborsMap[toStop.Name]
	if !ok {
		return routeSegments
	}
	for _, path := range paths {
		routeSegments = append(routeSegments, RouteSegment{
			FromStop:  fromStop,
			ToStop:    toStop,
			RoutePath: path,
		})
	}
	return routeSegments
}

func (r Routing) GetRouteSegments(segment RouteSegment) []RouteSegment {
	routeCode := segment.RoutePath.RouteCode
	routeStops := r.deps.routeStopMap[routeCode]
	routeSegments := []RouteSegment{}
	var flag = 0

	for index, stop := range routeStops {
		if index == (len(routeStops) - 1) {
			break
		}
		nextStop := routeStops[index+1]
		if stop.Name == segment.ToStop.Name {
			break
		}
		if stop.Name == segment.FromStop.Name {
			flag = 1
		}
		if flag == 1 {
			routeSegments = append(routeSegments, RouteSegment{
				FromStop: stop,
				ToStop:   nextStop,
				RoutePath: RoutePath{
					RouteCode: routeCode,
					Distance:  stop.NextDistance,
				},
			})
		}
	}
	return routeSegments
}

func (r Routing) GetRouteJourneys(fromStops, toStops []Stop) []RouteJourney {
	routeJourneys := []RouteJourney{}
	for _, fromStop := range fromStops {
		for _, toStop := range toStops {
			routeWholeSegments := r.GetSingleRouteWholeSigment(fromStop, toStop)
			for _, routeWholeSegment := range routeWholeSegments {
				err, vehicleTime := r.deps.invertedTimetable.GetNearestVehicle(routeWholeSegment.FromStop.Name, routeWholeSegment.RoutePath.RouteCode, r.GetTime())
				if err != nil {
					continue
				}
				segments := r.GetRouteSegments(routeWholeSegment)
				totalDistance := float64(0)
				for _, segment := range segments {
					totalDistance = totalDistance + segment.RoutePath.Distance
				}
				_, timeToArrive := r.deps.timetable.GetTimeOfArrival(vehicleTime.Vehicle, routeWholeSegment.ToStop.Name)
				journeyTime := timeToArrive - r.GetTime()
				if journeyTime < 0 {
					journeyTime = -journeyTime
				}
				routeJourneys = append(routeJourneys, RouteJourney{
					Segments:      segments,
					TotalDistance: totalDistance,
					Vehicles:      []VehicleTime{*vehicleTime},
					TotalTime:     journeyTime,
				})
			}
			routeWholeDoubleSegments := r.GetDoubleRouteWholeSigment(fromStop, toStop)
			for _, routeWholeDoubleSegment := range routeWholeDoubleSegments {
				routeSegments := []RouteSegment{}
				var erroredOut bool
				vehicleTimes := []VehicleTime{}
				time := r.GetTime()
				for _, routeWholeSegment := range routeWholeDoubleSegment {
					err, vehicleTime := r.deps.invertedTimetable.GetNearestVehicle(routeWholeSegment.FromStop.Name, routeWholeSegment.RoutePath.RouteCode, time)
					if err != nil || erroredOut {
						erroredOut = true
						continue
					}
					err, time = r.deps.timetable.GetTimeOfArrival(vehicleTime.Vehicle, routeWholeSegment.ToStop.Name)
					if err != nil || erroredOut {
						erroredOut = true
						continue
					}
					vehicleTimes = append(vehicleTimes, *vehicleTime)
					routeSegmentParts := r.GetRouteSegments(routeWholeSegment)
					for _, routeSegmentPart := range routeSegmentParts {
						routeSegments = append(routeSegments, routeSegmentPart)
					}
				}
				if erroredOut {
					continue
				}
				totalDistance := float64(0)
				for _, segment := range routeSegments {
					totalDistance = totalDistance + segment.RoutePath.Distance
				}
				journeyTime := time - r.GetTime()
				if journeyTime < 0 {
					journeyTime = -journeyTime
				}
				routeJourneys = append(routeJourneys, RouteJourney{
					Segments:      routeSegments,
					TotalDistance: totalDistance,
					Vehicles:      vehicleTimes,
					TotalTime:     journeyTime,
				})
			}
		}
	}
	sort.Slice(routeJourneys, func(i, j int) bool {
		return routeJourneys[i].TotalTime < routeJourneys[j].TotalTime
	})
	if len(routeJourneys) > MAX_JOURNEYS {
		return routeJourneys[:MAX_JOURNEYS]
	}
	return routeJourneys
}

func (r Routing) GetRoutesFromCoordinates(lat1, lng1, lat2, lng2 float64) []RouteJourney {
	fromStops := r.GetNearestStops(lat1, lng1)
	toStops := r.GetNearestStops(lat2, lng2)
	return r.GetRouteJourneys(fromStops, toStops)
}
