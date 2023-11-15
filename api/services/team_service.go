package services

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type TeamService struct {}

// GET
// 全てのチームの取得
func (s TeamService) GetAllTeams(db *gorm.DB) ([]Team, error) {
	var teams []Team
	if err := db.Find(&teams).Error; err != nil {
		return nil, err
	}
	return teams, nil
}

// idを指定してチームの取得
func (s TeamService) GetTeamById(db *gorm.DB, c echo.Context) (Team, error) {
	id := c.Param("id")
	var team Team
	if err := db.First(&team, id).Error; err != nil {
		return Team{}, err
	}
	return team, nil
}

// POST
// チームの作成
func (s TeamService) CreateTeam(db *gorm.DB, c echo.Context) (Team, error) {
	team := Team{}
	if err := c.Bind(&team); err != nil {
		return Team{}, err
	}
	if err := db.Create(&team).Error; err != nil {
		return Team{}, err
	}
	return team, nil
}

// PUT
// idを指定してチームの更新
func (s TeamService) UpdateTeamById(db *gorm.DB, c echo.Context) (Team, error) {
	team := Team{}
	id := c.Param("id")
	if err := c.Bind(&team); err != nil {
		return Team{}, err
	}
	if err := db.Model(&team).Where("id = ?", id).Updates(&team).Error; err != nil {
		return Team{}, err
	}
	return team, nil
}

// DELETE
// idを指定してチームの削除
func (s TeamService) DeleteTeamById(db *gorm.DB, c echo.Context) error {
	id := c.Param("id")
	if err := db.Delete(&Team{}, id).Error; err != nil {
		return err
	}
	return nil
}
