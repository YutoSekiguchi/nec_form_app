package controllers

import (
	"fmt"
	"net/http"

	"github.com/YutoSekiguchi/nec-form-app/services"
	"github.com/labstack/echo/v4"
)

// HandleGetAllAllViewFormCards GET /all_view_form_cards
func (ctrl Controller)HandleGetAllAllViewFormCards(c echo.Context) error {
	var s services.AllViewFormCardService
	p, err := s.GetAllAllViewFormCards(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}

// HandleGetAllViewFormCardById GET /all_view_form_cards/id/:id
func (ctrl Controller)HandleGetAllViewFormCardById(c echo.Context) error {
	var s services.AllViewFormCardService
	p, err := s.GetAllViewFormCardById(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}

// HandleGetAllViewFormCardByViewLongID GET /all_view_form_cards/view_long_id/:view_long_id
func (ctrl Controller)HandleGetAllViewFormCardByViewLongID(c echo.Context) error {
	var s services.AllViewFormCardService
	p, err := s.GetAllViewFormCardByViewLongID(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}

// HandleGetAllViewFormCardByViewLongIDAndFormID GET /all_view_form_cards/form_id/:form_id/view_long_id/:view_long_id
func (ctrl Controller)HandleGetAllViewFormCardByViewLongIDAndFormID(c echo.Context) error {
	var s services.AllViewFormCardService
	p, err := s.GetAllViewFormCardByViewLongIDAndFormID(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}


// HandleCreateAllViewFormCard POST /all_view_form_cards
func (ctrl Controller)HandleCreateAllViewFormCard(c echo.Context) error {
	var s services.AllViewFormCardService
	p, err := s.CreateAllViewFormCard(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}

// HandleDeleteAllViewFormCard DELETE /all_view_form_cards/:id
func (ctrl Controller)HandleDeleteAllViewFormCardById(c echo.Context) error {
	var s services.AllViewFormCardService
	err := s.DeleteAllViewFormCardById(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, nil)
	}
}
