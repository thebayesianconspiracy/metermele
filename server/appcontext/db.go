package appcontext

import (
	"log"
	"github.com/jmoiron/sqlx"
	"github.com/ppsreejith/vahana/config"
)

type context struct{
	db *sqlx.DB
}

var appContext context

func Init() {
	if appContext.db == nil {
		db, err := sqlx.Connect("postgres", config.GetDBConnURL())
		if err != nil {
			log.Fatal("Failed to connect to database")
			panic(err)
		}
		appContext.db = db
	}
}

func GetConn() *sqlx.DB{
	return appContext.db
}
