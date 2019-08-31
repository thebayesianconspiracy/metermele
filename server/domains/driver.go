package domain

import (
	"time"
)

type Driver struct {
	ID int64 `db:"id" json:"id"`
	Username string `db:"username" json:"username"`
	VehicleID string `db:"vehicle_id" json:"vehicle_id"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
	UpdatedAt time.Time `db:"updated_at" json:"updated_at"`
}
