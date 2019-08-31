package repository

import (
	"github.com/ppsreejith/vahana/appcontext"
	"github.com/ppsreejith/vahana/domains"
)

func AddUser(username string) (int64, error) {
	var id int64;
	db := appcontext.GetConn()
	
	err := db.QueryRow(
		"INSERT INTO users(username) VALUES ($1) RETURNING id;",
		username,
	).Scan(&id)
	
	return id, err
}

func FindUserByUsername(username string) (user domain.User, err error) {
	db := appcontext.GetConn()
	err = db.QueryRowx(
		"select * from users where username = $1;",
		username,
	).StructScan(&user)
	return
}

func FindUserByID(id int64) (user domain.User, err error) {
	db := appcontext.GetConn()
	err = db.QueryRowx(
		"select * from users where id = $1;",
		id,
	).StructScan(&user)
	return
}
