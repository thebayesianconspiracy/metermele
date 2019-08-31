package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/ppsreejith/vahana/repository"
)

type driverParams struct {
	Username string `json:"username"`
	VehicleID string `json:"vehicle_id"`
}

func CreateDriverHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var driver driverParams
	err := decoder.Decode(&driver)
	if err != nil || driver.Username == "" || driver.VehicleID == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	driverID, err := repository.AddDriver(driver.Username, driver.VehicleID)
	if err != nil {
		driver, err := repository.FindDriverByUsername(driver.Username)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		driverID = driver.ID
	}
	data, _ := json.Marshal(map[string]interface{}{
		"success": true,
		"driver_id": driverID,
	})
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

func GetDriverHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	driverID, err := strconv.ParseInt(params["driverID"], 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	driver, err := repository.FindDriverByID(driverID)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	data, _ := json.Marshal(map[string]interface{}{
		"success": true,
		"data": driver,
	})
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}
