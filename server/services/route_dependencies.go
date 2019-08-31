package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"sort"

	"github.com/dhconnelly/rtreego"
	"github.com/golang/geo/s2"
)

type Position struct {
	Longitude float64 `json:"Longitude"`
	Latitude  float64 `json:"Latitude"`
}

type Stop struct {
	Name         string   `json:"StopPointName"`
	Location     Position `json:"Location"`
	LineRef      string   `json:"LineRef"`
	Order        float64  `json:"Order"`
	NextDistance float64  `json:"nextDistance"`
}

type StopMap map[string]Stop

type RoutePath struct {
	RouteCode string  `json:"route_code"`
	Distance  float64 `json:"distance"`
}

type RouteStopMap map[string][]Stop

type RouteMap map[string][]RoutePath
type Route map[string]RouteMap

type StopArrival map[string]int
type BusStopArrival map[string]StopArrival

type VehicleTime struct {
	Time    int
	Vehicle string
}
type VehicleAtStop map[string][]VehicleTime
type VehicleAtStopAtRoute map[string]VehicleAtStop

type RTreePoint struct {
	location rtreego.Point
	stop     Stop
}

type PointsMap = map[string]RTreePoint

type RouteDependency struct {
	stopMap StopMap
	toRouteMap Route
	fromRouteMap Route
	routeStopMap RouteStopMap
	timetable BusStopArrival
	invertedTimetable VehicleAtStopAtRoute
	vehicleMonitoring VehicleMonitoring
	rTree *rtreego.Rtree
	pointsMap PointsMap
}

const tol = 0.001

func LoadRouteDependencies() RouteDependency {
	stopMap := LoadStops("./resources/stops.json")
	toRouteMap := LoadPaths("./resources/to-graph.json")
	fromRouteMap := LoadPaths("./resources/from-graph.json")
	routeStopMap := LoadRoutes("./resources/routes.json")
	timetable := LoadTimetable("./resources/timetable.json")
	invertedTimetable := LoadInvertedTimetable("./resources/inverted-timetable.json")
	var vehicleMonitoring VehicleMonitoring
	vehicleMonitoring.GetData()
	rt, pointsMap := createLatLngTree(stopMap)
	return RouteDependency{
		stopMap,
		toRouteMap,
		fromRouteMap,
		routeStopMap,
		timetable,
		invertedTimetable,
		vehicleMonitoring,
		rt,
		pointsMap,
	}
}

func (fromStop Stop) GetDistance(lat, lng float64) float64 {
	lat1 := fromStop.Location.Latitude
	lat2 := fromStop.Location.Longitude
	p1 := s2.LatLngFromDegrees(lat1, lat2)
	p2 := s2.LatLngFromDegrees(lat, lat)
	return float64(p1.Distance(p2))
}

func (s RTreePoint) Bounds() *rtreego.Rect {
	return s.location.ToRect(tol)
}

func createLatLngTree(stopMap StopMap) (*rtreego.Rtree, PointsMap) {
	rt := rtreego.NewTree(2, 25, 50)
	points := []RTreePoint{}
	for _, stop := range stopMap {
		points = append(points, RTreePoint{rtreego.Point{stop.Location.Latitude, stop.Location.Longitude}, stop})
	}
	pointsMap := make(PointsMap)
	for _, point := range points {
		pointsMap[point.location.ToRect(tol).String()] = point
		rt.Insert(point)
	}
	return rt, pointsMap
}

func (b BusStopArrival) GetTimeOfArrival(vehicle string, stop string) (error, int) {
	err := errors.New("Couldn't find")
	stopMap, ok := b[vehicle]
	if !ok {
		return err, 0
	}
	timeOfArrival, ok := stopMap[stop]
	if !ok {
		return err, 0
	}
	return nil, timeOfArrival
}

func (v VehicleAtStopAtRoute) GetNearestVehicle(stop string, route string, time int) (error, *VehicleTime) {
	stopMap, ok := v[route]
	err := errors.New("Couldn't find")
	if !ok {
		return err, nil
	}
	vehicleTimes, ok := stopMap[stop]
	if !ok {
		return err, nil
	}
	index := sort.Search(len(vehicleTimes), func(index int) bool {
		return vehicleTimes[index].Time > time
	})
	if index == len(vehicleTimes) {
		return err, nil
	}
	return nil, &vehicleTimes[index]
}

type Vehicle struct {
	Location    Position `json:"location"`
	Destination string   `json:"destination"`
}

type VehicleMonitoring struct {
	Data map[string]Vehicle
}

func (v *VehicleMonitoring) GetData() {
	configFile, err := os.Open("./resources/vehicles.json")
	defer configFile.Close()
	if err != nil {
		fmt.Println(err.Error())
	}
	jsonParser := json.NewDecoder(configFile)
	vehicleData := make(map[string]Vehicle)
	jsonParser.Decode(&vehicleData)
	v.Data = vehicleData
}

func LoadStops(file string) StopMap {
	configFile, err := os.Open(file)
	defer configFile.Close()
	if err != nil {
		fmt.Println(err.Error())
	}
	jsonParser := json.NewDecoder(configFile)
	var stops []Stop
	jsonParser.Decode(&stops)
	stopMap := make(StopMap)
	for _, stop := range stops {
		stopMap[stop.Name] = stop
	}
	return stopMap
}

func LoadPaths(file string) Route {
	configFile, err := os.Open(file)
	defer configFile.Close()
	if err != nil {
		fmt.Println(err.Error())
	}
	var route Route
	jsonParser := json.NewDecoder(configFile)
	jsonParser.Decode(&route)
	return route
}

func LoadRoutes(file string) RouteStopMap {
	configFile, err := os.Open(file)
	defer configFile.Close()
	if err != nil {
		fmt.Println(err.Error())
	}
	jsonParser := json.NewDecoder(configFile)
	var routemap RouteStopMap
	jsonParser.Decode(&routemap)
	return routemap
}

func LoadTimetable(file string) BusStopArrival {
	configFile, err := os.Open(file)
	defer configFile.Close()
	if err != nil {
		fmt.Println(err.Error())
	}
	jsonParser := json.NewDecoder(configFile)
	var busStopArrival BusStopArrival
	jsonParser.Decode(&busStopArrival)
	return busStopArrival
}

func LoadInvertedTimetable(file string) VehicleAtStopAtRoute {
	configFile, err := os.Open(file)
	defer configFile.Close()
	if err != nil {
		fmt.Println(err.Error())
	}
	jsonParser := json.NewDecoder(configFile)
	var vehicleAtStopAtRoute VehicleAtStopAtRoute
	jsonParser.Decode(&vehicleAtStopAtRoute)
	for _, stopMap := range vehicleAtStopAtRoute {
		for _, vehicleTimes := range stopMap {
			sort.Slice(vehicleTimes, func(i, j int) bool {
				return vehicleTimes[i].Time < vehicleTimes[j].Time
			})
		}
	}
	return vehicleAtStopAtRoute
}
