package services

import (
	"github.com/YutoSekiguchi/nec-form-app/models"
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type AllViewFormCardService struct {}

// GET
// 全て取得
func (s AllViewFormCardService) GetAllAllViewFormCards(db *gorm.DB, c echo.Context) ([]models.AllViewFormCard, error) {
	var allViewFormCards []models.AllViewFormCard
	if err := db.Find(&allViewFormCards).Error; err != nil {
		return nil, err
	}
	return allViewFormCards, nil
}

// idを指定して取得
func (s AllViewFormCardService) GetAllViewFormCardById(db *gorm.DB, c echo.Context) (models.AllViewFormCard, error) {
	id := c.Param("id")
	var allViewFormCard models.AllViewFormCard
	if err := db.First(&allViewFormCard, id).Error; err != nil {
		return models.AllViewFormCard{}, err
	}
	return allViewFormCard, nil
}

// view_long_idを指定して取得
func (s AllViewFormCardService) GetAllViewFormCardByViewLongID(db *gorm.DB, c echo.Context) ([]models.AllViewFormCard, error) {
	viewLongID := c.Param("view_long_id")
	var allViewFormCard []models.AllViewFormCard
	if err := db.Where("view_long_id = ?", viewLongID).Find(&allViewFormCard).Error; err != nil {
		return nil, err
	}
	return allViewFormCard, nil
}


// POST
// AllViewFormCardの作成
func (s AllViewFormCardService) CreateAllViewFormCard(db *gorm.DB, c echo.Context) (models.AllViewFormCard, error) {
	allViewFormCard := models.AllViewFormCard{}
	if err := c.Bind(&allViewFormCard); err != nil {
		return models.AllViewFormCard{}, err
	}

	// もしすでに同じlong_idが存在したら上書きする
	var oldAllViewFormCard models.AllViewFormCard
	if err := db.Where("view_long_id = ?", allViewFormCard.ViewLongID).Find(&oldAllViewFormCard).Error; err != nil {
		return models.AllViewFormCard{}, err
	}
	if oldAllViewFormCard.ID != 0 {
		allViewFormCard.ID = oldAllViewFormCard.ID
		if err := db.Model(&allViewFormCard).Where("id = ?", allViewFormCard.ID).Updates(&allViewFormCard).Error; err != nil {
			return models.AllViewFormCard{}, err
		}
		return allViewFormCard, nil
	}

	if err := db.Create(&allViewFormCard).Error; err != nil {
		return models.AllViewFormCard{}, err
	}
	return allViewFormCard, nil
}


// DELETE
// idを指定して削除
func (s AllViewFormCardService) DeleteAllViewFormCardById(db *gorm.DB, c echo.Context) error {
	id := c.Param("id")
	var allViewFormCard models.AllViewFormCard
	if err := db.First(&allViewFormCard, id).Error; err != nil {
		return err
	}
	if err := db.Delete(&allViewFormCard).Error; err != nil {
		return err
	}
	return nil
}