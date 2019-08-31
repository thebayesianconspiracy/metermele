package domain

import (
	"database/sql"
	"encoding/json"
	"time"
)

type JsonNullInt64 struct {
	sql.NullInt64
}

func (v JsonNullInt64) MarshalJSON() ([]byte, error) {
	if v.Valid {
		return json.Marshal(v.Int64)
	} else {
		return json.Marshal(nil)
	}
}

type Bid struct {
	ID          int64         `db:"id" json:"id"`
	UserID      int64         `db:"user_id" json:"user_id"`
	Metermele   int64         `db:"metermele" json:"metermele"`
	DriverID    JsonNullInt64 `db:"driver_id" json:"driver_id"`
	OTP         string        `db:"otp" json:"otp"`
	FromLat     float64       `db:"from_lat" json:"from_lat"`
	FromLng     float64       `db:"from_lng" json:"from_lng"`
	FromAddress string        `db:"from_address" json:"from_address"`
	ToLat       float64       `db:"to_lat" json:"to_lat"`
	ToLng       float64       `db:"to_lng" json:"to_lng"`
	ToAddress   string        `db:"to_address" json:"to_address"`
	CreatedAt   time.Time     `db:"created_at" json:"created_at"`
	UpdatedAt   time.Time     `db:"updated_at" json:"updated_at"`
}
