package handlers

import (
	"encoding/json"
	"math/rand"
	"net/http"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
	"github.com/ppsreejith/vahana/repository"
	"github.com/ppsreejith/vahana/utils"
)

type bidParams struct {
	UserID      int64   `json:"user_id"`
	Metermele   int64   `json:"metermele"`
	FromLat     float64 `json:"from_lat"`
	FromLng     float64 `json:"from_lng"`
	FromAddress string  `json:"from_address"`
	ToLat       float64 `json:"to_lat"`
	ToLng       float64 `json:"to_lng"`
	ToAddress   string  `json:"to_address"`
}

func CreateBidHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var bid bidParams
	err := decoder.Decode(&bid)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	otpNumbers := []string{
		strconv.Itoa(rand.Intn(10)),
		strconv.Itoa(rand.Intn(10)),
		strconv.Itoa(rand.Intn(10)),
		strconv.Itoa(rand.Intn(10)),
	}
	otp := strings.Join(otpNumbers, "")
	bidID, err := repository.AddBid(
		bid.UserID,
		bid.Metermele,
		otp,
		bid.FromLat,
		bid.FromLng,
		bid.FromAddress,
		bid.ToLat,
		bid.ToLng,
		bid.ToAddress,
	)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	bidData, err := repository.FindBidByID(bidID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	data, _ := json.Marshal(map[string]interface{}{
		"success": true,
		"data":    bidData,
	})
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

type acceptbidParams struct {
	DriverID int64 `json:"driver_id"`
}

func AcceptBidHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	bidID, err := strconv.ParseInt(params["bidID"], 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	decoder := json.NewDecoder(r.Body)
	var acceptbid acceptbidParams
	err = decoder.Decode(&acceptbid)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	err = repository.AcceptBid(
		bidID,
		acceptbid.DriverID,
	)
	bidData, err2 := repository.FindBidByID(bidID)
	if err2 != nil || (err != nil && bidData.DriverID.Int64 != acceptbid.DriverID) {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	data, _ := json.Marshal(map[string]interface{}{
		"success": true,
		"data":    bidData,
	})
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

func GetActiveBidsHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	latlngStr := params["latlng"]
	if latlngStr == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	err, lat, lng := utils.GetLatLngFromParams(latlngStr)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	bids, err := repository.FindActiveBidsByLatLng(lat, lng)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	data, _ := json.Marshal(map[string]interface{}{
		"success": true,
		"data":    bids,
	})
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

func GetBidHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	bidID, err := strconv.ParseInt(params["bidID"], 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	bid, err := repository.FindBidByID(bidID)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	data, _ := json.Marshal(map[string]interface{}{
		"success": true,
		"data":    bid,
	})
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}
