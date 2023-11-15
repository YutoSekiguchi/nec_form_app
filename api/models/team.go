package models

import (
	"time"
)

type Team struct {
	ID          int       `gorm:"primary_key;not null;autoIncrement:true"`
	Name        string    `gorm:"type:text;not null"`
	CreatedAt   time.Time `sql:"DEFAULT:current_timestamp;column:created_at"`
}