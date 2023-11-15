package controllers

import (
	"fmt"
	"net/http"

	"github.com/YutoSekiguchi/nec-form-app/services"
	"github.com/labstack/echo/v4"
)

// HandleGetAllTeams GET /teams
func (ctrl Controller)HandleGetAllTeams(c echo.Context) error {
	var s services.TeamService
	p, err := s.GetAllTeams(ctrl.Db)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}

// HandleGetTeamById GET /teams/id/:id
func (ctrl Controller)HandleGetTeamById(c echo.Context) error {
	var s services.TeamService
	p, err := s.GetTeamById(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}

// HandleCreateTeam POST /teams
func (ctrl Controller)HandleCreateTeam(c echo.Context) error {
	var s services.TeamService
	p, err := s.CreateTeam(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}

// HandleUpdateTeamById PUT /teams/id/:id
func (ctrl Controller)HandleUpdateTeamById(c echo.Context) error {
	var s services.TeamService
	p, err := s.UpdateTeamById(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, p)
	}
}


// HandleDeleteTeamById DELETE /teams/id/:id
func (ctrl Controller)HandleDeleteTeamById(c echo.Context) error {
	var s services.TeamService
	err := s.DeleteTeamById(ctrl.Db, c)
	if err != nil {
		fmt.Println(err)
		return c.JSON(http.StatusNotFound, err.Error())
	} else {
		return c.JSON(200, "Deleted")
	}
}