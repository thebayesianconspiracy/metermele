package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/ppsreejith/vahana/repository"
)

type userParams struct {
	Username string `json:"username"`
}

func CreateUserHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var user userParams
	err := decoder.Decode(&user)
	if err != nil || user.Username == "" {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	userID, err := repository.AddUser(user.Username)
	if err != nil {
		user, err := repository.FindUserByUsername(user.Username)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		userID = user.ID
	}
	data, _ := json.Marshal(map[string]interface{}{
		"success": true,
		"user_id": userID,
	})
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

func GetUserHandler(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	userID, err := strconv.ParseInt(params["userID"], 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	user, err := repository.FindUserByID(userID)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	data, _ := json.Marshal(map[string]interface{}{
		"success": true,
		"data": user,
	})
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}
