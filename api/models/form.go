package models

import (
	"time"
)

type Form struct {
	ID                 int       `gorm:"primary_key;not null;autoIncrement:true"`
	LongID             string    `gorm:"type:text;not null"`
	TID                int       `gorm:"not null"`
	Hypothesis         string    `gorm:"type:text;not null"`
	Observation        string    `gorm:"type:text;not null"`
	ObservationResult  string    `gorm:"type:text;not null"`
	Hearing            string    `gorm:"type:text;not null"`
	HearingResult      string    `gorm:"type:text;not null"`
	CreatedAt          time.Time `sql:"DEFAULT:current_timestamp;column:created_at"`
	UpdatedAt          time.Time `sql:"DEFAULT:current_timestamp;column:updated_at"`
}