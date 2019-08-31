package server

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"

	"github.com/ppsreejith/vahana/appcontext"
	"github.com/ppsreejith/vahana/config"
	h "github.com/ppsreejith/vahana/handlers"
	"github.com/ppsreejith/vahana/services"
)

func jsonMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")
		next.ServeHTTP(w, r)
	})
}

func GetTime() int {
	return 1556460882000
}

func StartServer() {
	appcontext.Init()
	routing := services.CreateRouter(GetTime)
	r := mux.NewRouter()
	r.Use(jsonMiddleware)
	r.HandleFunc("/routes/{latlng1}/{latlng2}", h.GetRoutesHandler(routing)).Methods("GET")
	r.HandleFunc("/users/{userID}", h.GetUserHandler).Methods("GET")
	r.HandleFunc("/users", h.CreateUserHandler).Methods("POST")
	r.HandleFunc("/drivers/{driverID}", h.GetDriverHandler).Methods("GET")
	r.HandleFunc("/drivers", h.CreateDriverHandler).Methods("POST")
	r.HandleFunc("/activebids/{latlng}", h.GetActiveBidsHandler).Methods("GET")
	r.HandleFunc("/bids/{bidID}", h.GetBidHandler).Methods("GET")
	r.HandleFunc("/bids", h.CreateBidHandler).Methods("POST")
	r.HandleFunc("/bids/{bidID}", h.AcceptBidHandler).Methods("POST")
	initServer(r)
}

func initServer(r *mux.Router) {
	host := config.Config().GetString("host")
	port := config.Config().GetString("port")
	srv := &http.Server{
		Addr:         fmt.Sprintf("%s:%s", host, port),
		WriteTimeout: time.Second * 15,
		ReadTimeout:  time.Second * 15,
		IdleTimeout:  time.Second * 60,
		Handler:      handlers.CORS()(r),
	}
	log.Printf("Started Server for host %s and port %s", host, port)
	if err := srv.ListenAndServe(); err != nil {
		log.Println(err)
	}
}
