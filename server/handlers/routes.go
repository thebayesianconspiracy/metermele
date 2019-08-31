package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/ppsreejith/vahana/services"
	"github.com/ppsreejith/vahana/utils"
)

func GetRoutesHandler(routing services.Routing) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		latlngStr := params["latlng1"]
		if latlngStr == "" {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		err, lat1, lng1 := utils.GetLatLngFromParams(params["latlng1"])
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		err, lat2, lng2 := utils.GetLatLngFromParams(params["latlng2"])
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		routes := routing.GetRoutesFromCoordinates(lat1, lng1, lat2, lng2)
		mostDifferentRoutes := []services.RouteJourney{}
		if len(routes) > 1 {
			mostDifferentRoutes = []services.RouteJourney{routes[0], routes[len(routes)-1]}
		}
		data, err := json.Marshal(map[string][]services.RouteJourney{
			"journeys": mostDifferentRoutes,
		})
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write(data)
	}
}
