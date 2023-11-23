package router

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"gorm.io/gorm"

	"github.com/YutoSekiguchi/nec-form-app/controllers"
)

func InitRouter(db *gorm.DB) {
	e := echo.New()

	// Middleware
	e.Use(middleware.LoggerWithConfig(middleware.LoggerConfig{
		Format: "method=${method}, uri=${uri}, status=${status}\n",
	}))
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000", "http://localhost:7140", "https://vps7.nkmr.io", "http://vps7.nkmr.io"},
		AllowHeaders: []string{echo.HeaderAuthorization, echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))
	ctrl := controllers.NewController(db)
	
	team := e.Group("/teams")
	{
		team.GET("", ctrl.HandleGetAllTeams)
		team.GET("/:id", ctrl.HandleGetTeamById)
		team.POST("", ctrl.HandleCreateTeam)
		team.PUT("/:id", ctrl.HandleUpdateTeamById)
		team.DELETE("/:id", ctrl.HandleDeleteTeamById)
	}

	form := e.Group("/forms")
	{
		form.GET("", ctrl.HandleGetAllForms)
		form.GET("/id/:id", ctrl.HandleGetFormById)
		form.GET("/tid/:tid", ctrl.HandleGetFormByTID)
		form.GET("/longid/:longid", ctrl.HandleGetFormByLongID)
		form.POST("", ctrl.HandleCreateForm)
		form.PUT("/id/:id", ctrl.HandleUpdateFormById)
		form.DELETE("/id/:id", ctrl.HandleDeleteFormById)
	}

	form_setting := e.Group("/form_settings")
	{
		form_setting.GET("", ctrl.HandleGetAllFormSettings)
		form_setting.GET("/tid/:tid", ctrl.HandleGetFormSettingsByTID)
		form_setting.GET("/id/:id", ctrl.HandleGetFormSettingById)
		form_setting.GET("/form_id/:form_id", ctrl.HandleGetFormSettingByFormID)
		form_setting.POST("", ctrl.HandleCreateFormSetting)
		form_setting.DELETE("/id/:id", ctrl.HandleDeleteFormSettingById)
	}

	// Routing
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, Echo!")
	})

	e.Logger.Fatal(e.Start(":8080"))
}