package services

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type AllViewSettingService struct {}

// GET
// 全て取得
func (s AllViewSettingService) GetAllAllViewSettings(db *gorm.DB, c echo.Context) ([]AllViewSetting, error) {
	var allViewSettings []AllViewSetting
	if err := db.Find(&allViewSettings).Error; err != nil {
		return nil, err
	}
	return allViewSettings, nil
}

// idを指定して取得
func (s AllViewSettingService) GetAllViewSettingById(db *gorm.DB, c echo.Context) (AllViewSetting, error) {
	id := c.Param("id")
	var allViewSetting AllViewSetting
	if err := db.First(&allViewSetting, id).Error; err != nil {
		return AllViewSetting{}, err
	}
	return allViewSetting, nil
}

// long_idを指定して取得
func (s AllViewSettingService) GetAllViewSettingByLongID(db *gorm.DB, c echo.Context) (AllViewSetting, error) {
	longID := c.Param("long_id")
	var allViewSetting AllViewSetting
	if err := db.Where("long_id = ?", longID).First(&allViewSetting).Error; err != nil {
		return AllViewSetting{}, err
	}
	return allViewSetting, nil
}


// POST
// フォームの作成
func (s AllViewSettingService) CreateAllViewSetting(db *gorm.DB, c echo.Context) (AllViewSetting, error) {
	allViewSetting := AllViewSetting{}
	if err := c.Bind(&allViewSetting); err != nil {
		return AllViewSetting{}, err
	}

	// もしすでに同じlong_idが存在したら上書きする
	var oldAllViewSetting AllViewSetting
	if err := db.Where("long_id = ?", allViewSetting.LongID).Find(&oldAllViewSetting).Error; err != nil {
		return AllViewSetting{}, err
	}
	if oldAllViewSetting.ID != 0 {
		allViewSetting.ID = oldAllViewSetting.ID
		if err := db.Model(&allViewSetting).Where("id = ?", allViewSetting.ID).Updates(&allViewSetting).Error; err != nil {
			return AllViewSetting{}, err
		}
		return allViewSetting, nil
	}

	if err := db.Create(&allViewSetting).Error; err != nil {
		return AllViewSetting{}, err
	}
	return allViewSetting, nil
}

// DELETE
// idを指定して削除
func (s AllViewSettingService) DeleteAllViewSettingById(db *gorm.DB, c echo.Context) error {
	id := c.Param("id")
	if err := db.Delete(&AllViewSetting{}, id).Error; err != nil {
		return err
	}
	return nil
}