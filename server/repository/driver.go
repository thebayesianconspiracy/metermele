package repository

import (
	"github.com/ppsreejith/vahana/appcontext"
	"github.com/ppsreejith/vahana/domains"
)

func AddDriver(username string, vehicleID string) (int64, error) {
	var id int64;
	db := appcontext.GetConn()
	
	err := db.QueryRow(
		"INSERT INTO drivers(username, vehicle_id) VALUES ($1, $2) RETURNING id;",
		username,
		vehicleID,
	).Scan(&id)
	
	return id, err
}

func FindDriverByUsername(username string) (driver domain.Driver, err error) {
	db := appcontext.GetConn()
	err = db.QueryRowx(
		"select * from drivers where username = $1;",
		username,
	).StructScan(&driver)
	return
}

func FindDriverByID(id int64) (driver domain.Driver, err error) {
	db := appcontext.GetConn()
	err = db.QueryRowx(
		"select * from drivers where id = $1;",
		id,
	).StructScan(&driver)
	return
}
