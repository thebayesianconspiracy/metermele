package domain

import (
	"time"
)

type User struct {
	ID int64 `db:"id" json:"id"`
	Username string `db:"username" json:"username"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
	UpdatedAt time.Time `db:"updated_at" json:"updated_at"`
}
