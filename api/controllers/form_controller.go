package controllers

import (
	"fmt"
	"net/http"

	"github.com/YutoSekiguchi/nec-form-app/services"
	"github.com/labstack/echo/v4"
)

// HandleGetAllForms GET /forms
func (ctrl Controller)HandleGetAllForms(c echo.Context) error {
	var s services.FormService
	p, err := s.GetAllForms(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}

// HandleGetFormById GET /forms/id/:id
func (ctrl Controller)HandleGetFormById(c echo.Context) error {
	var s services.FormService
	p, err := s.GetFormById(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}

// HandleGetFormByTID GET /forms/tid/:tid
func (ctrl Controller)HandleGetFormByTID(c echo.Context) error {
	var s services.FormService
	p, err := s.GetFormByTID(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}

// HandleGetFormByLongID GET /forms/longid/:longid
func (ctrl Controller)HandleGetFormByLongID(c echo.Context) error {
	var s services.FormService
	p, err := s.GetFormByLongID(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}

// HandleCreateForm POST /forms
func (ctrl Controller)HandleCreateForm(c echo.Context) error {
	var s services.FormService
	p, err := s.CreateForm(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}

// HandleUpdateFormById PUT /forms/id/:id
func (ctrl Controller)HandleUpdateFormById(c echo.Context) error {
	var s services.FormService
	p, err := s.UpdateFormById(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}

// HandleDeleteFormById DELETE /forms/id/:id
func (ctrl Controller)HandleDeleteFormById(c echo.Context) error {
	var s services.FormService
	err := s.DeleteFormById(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, "deleted")
	}
}