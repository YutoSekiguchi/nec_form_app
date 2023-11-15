package controllers

import (
	"gorm.io/gorm"
)

// Controller Struct
type Controller struct {
	Db *gorm.DB
}

func NewController(db *gorm.DB) *Controller {
	return &Controller{
		Db: db,
	}
}