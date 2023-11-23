package models

import (
	"time"
)


type FormSetting struct {
	ID              int       `gorm:"primary_key;not null;autoIncrement:true"`
	TID             int       `gorm:"column:t_id"`
	FormID          string    `gorm:"column:form_id"`
	FormGroupingID  int       `gorm:"column:form_grouping_id"`
	Color           string    `gorm:"type:text;not null"`
	BackgroundColor string    `gorm:"type:text;not null"`
	PositionTop		 float64       `gorm:"column:position_top"`
	PositionLeft	 float64       `gorm:"column:position_left"`
	CreatedAt       time.Time `sql:"DEFAULT:current_timestamp;column:created_at"`
}