package models

import (
	"time"
)

type AllViewSetting struct {
	ID        int       `gorm:"primary_key;not null;autoIncrement:true"`
	TID       int       `gorm:"column:t_id"`
	LongID    string    `gorm:"column:long_id"`
	Title     string    `gorm:"column:title"`
	Image		  string    `gorm:"column:image"`
	CreatedAt time.Time `sql:"DEFAULT:current_timestamp;column:created_at"`
	UpdateAt  time.Time `sql:"DEFAULT:current_timestamp;column:update_at"`
}
