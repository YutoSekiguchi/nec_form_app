package controllers

import (
	"fmt"
	"net/http"

	"github.com/YutoSekiguchi/nec-form-app/services"
	"github.com/labstack/echo/v4"
)

// HandleGetAllFormSettings GET /form_settings
func (ctrl Controller)HandleGetAllFormSettings(c echo.Context) error {
	var s services.FormSettingService
	p, err := s.GetAllFormSettings(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}

// HandleGetFormSettingsByTID GET /form_settings/tid/:tid
func (ctrl Controller)HandleGetFormSettingsByTID(c echo.Context) error {
	var s services.FormSettingService
	p, err := s.GetFormSettingsByTID(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}

// HandleGetFormSettingById GET /form_settings/id/:id
func (ctrl Controller)HandleGetFormSettingById(c echo.Context) error {
	var s services.FormSettingService
	p, err := s.GetFormSettingById(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}

// HandleGetFormSettingByFormID GET /form_settings/form_id/:form_id
func (ctrl Controller)HandleGetFormSettingByFormID(c echo.Context) error {
	var s services.FormSettingService
	p, err := s.GetFormSettingByFormID(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}

// HandleCreateFormSetting POST /form_settings
func (ctrl Controller)HandleCreateFormSetting(c echo.Context) error {
	var s services.FormSettingService
	p, err := s.CreateFormSetting(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(201, p)
	}
}

// HandleDeleteFormSettingById DELETE /form_settings/id/:id
func (ctrl Controller)HandleDeleteFormSettingById(c echo.Context) error {
	var s services.FormSettingService
	err := s.DeleteFormSettingById(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(204, nil)
	}
}