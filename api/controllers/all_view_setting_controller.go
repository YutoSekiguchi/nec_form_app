package controllers

import (
	"fmt"
	"net/http"

	"github.com/YutoSekiguchi/nec-form-app/services"
	"github.com/labstack/echo/v4"
)

// HandleGetAllAllViewSettings GET /all_view_settings
func (ctrl Controller)HandleGetAllAllViewSettings(c echo.Context) error {
	var s services.AllViewSettingService
	p, err := s.GetAllAllViewSettings(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}

// HandleGetAllViewSettingById GET /all_view_settings/id/:id
func (ctrl Controller)HandleGetAllViewSettingById(c echo.Context) error {
	var s services.AllViewSettingService
	p, err := s.GetAllViewSettingById(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}

// HandleGetAllViewSettingByLongID GET /all_view_settings/long_id/:long_id
func (ctrl Controller)HandleGetAllViewSettingByLongID(c echo.Context) error {
	var s services.AllViewSettingService
	p, err := s.GetAllViewSettingByLongID(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}


// HandleCreateAllViewSetting POST /all_view_settings
func (ctrl Controller)HandleCreateAllViewSetting(c echo.Context) error {
	var s services.AllViewSettingService
	p, err := s.CreateAllViewSetting(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}

// HandleDeleteAllViewSetting DELETE /all_view_settings/:id
func (ctrl Controller)HandleDeleteAllViewSettingById(c echo.Context) error {
	var s services.AllViewSettingService
	err := s.DeleteAllViewSettingById(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, nil)
	}
}