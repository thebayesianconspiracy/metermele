package repository

import (
	"errors"
	"fmt"

	"github.com/ppsreejith/vahana/appcontext"
	"github.com/ppsreejith/vahana/config"
	domain "github.com/ppsreejith/vahana/domains"
)

func AddBid(userID int64, metermele int64, otp string, fromLat float64, fromLng float64, fromAddress string, toLat float64, toLng float64, toAddress string) (id int64, err error) {
	db := appcontext.GetConn()
	err = db.QueryRowx(
		"INSERT INTO bids(user_id, metermele, otp, from_lat, from_lng, from_address, to_lat, to_lng, to_address) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id;",
		userID,
		metermele,
		otp,
		fromLat,
		fromLng,
		fromAddress,
		toLat,
		toLng,
		toAddress,
	).Scan(&id)
	return
}

func getRecencyCheck() string {
	maxTime := config.Config().GetInt("bid_max_active_minutes")
	return fmt.Sprintf("NOW() - INTERVAL '%d minutes'", maxTime)
}

func FindActiveBidsByLatLng(fromLat float64, fromLng float64) ([]domain.Bid, error) {
	db := appcontext.GetConn()
	bids := []domain.Bid{}
	maxRange := config.Config().GetInt("bid_default_range")
	latlngRange := float64(maxRange) / 55.0
	maxLat := fromLat + latlngRange
	minLat := fromLat - latlngRange
	maxLng := fromLng + latlngRange
	minLng := fromLng - latlngRange
	rows, err := db.Queryx(
		fmt.Sprintf("select * from bids where from_lat > $1 AND from_lat < $2 AND from_lng > $3 AND from_lng < $4 AND driver_id is NULL AND created_at > %s;", getRecencyCheck()),
		minLat,
		maxLat,
		minLng,
		maxLng,
	)
	if err != nil {
		return bids, err
	}
	for rows.Next() {
		var bid domain.Bid
		err = rows.StructScan(&bid)
		if err != nil {
			return bids, err
		}
		bids = append(bids, bid)
	}
	return bids, err
}

func AcceptBid(id int64, driverID int64) (err error) {
	db := appcontext.GetConn()
	var updatedCount int
	err = db.QueryRowx(
		fmt.Sprintf("update bids set driver_id = $1, updated_at = NOW() where id = $2 AND driver_id is NULL AND created_at > %s;", getRecencyCheck()),
		driverID,
		id,
	).Scan(&updatedCount)
	if err == nil && updatedCount == 0 {
		err = errors.New("Couldn't accept bid")
	}
	return
}

func FindBidByID(id int64) (bid domain.Bid, err error) {
	db := appcontext.GetConn()
	err = db.QueryRowx(
		"select * from bids where id = $1;",
		id,
	).StructScan(&bid)
	return
}
