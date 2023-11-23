package services

import (
	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type FormSettingService struct {}

// GET
// 全て取得
func (s FormSettingService) GetAllFormSettings(db *gorm.DB, c echo.Context) ([]FormSetting, error) {
	var formSettings []FormSetting
	if err := db.Find(&formSettings).Error; err != nil {
		return nil, err
	}
	return formSettings, nil
}

// tid一致を全て取得
func (s FormSettingService) GetFormSettingsByTID(db *gorm.DB, c echo.Context) ([]FormSetting, error) {
	tid := c.Param("tid")
	var formSettings []FormSetting
	if err := db.Where("t_id = ?", tid).Find(&formSettings).Error; err != nil {
		return nil, err
	}
	return formSettings, nil
}

// idを指定して取得
func (s FormSettingService) GetFormSettingById(db *gorm.DB, c echo.Context) (FormSetting, error) {
	id := c.Param("id")
	var formSetting FormSetting
	if err := db.First(&formSetting, id).Error; err != nil {
		return FormSetting{}, err
	}
	return formSetting, nil
}

// FormIDを指定して取得
func (s FormSettingService) GetFormSettingByFormID(db *gorm.DB, c echo.Context) (FormSetting, error) {
	formID := c.Param("form_id")
	var formSetting FormSetting
	if err := db.Where("form_id = ?", formID).First(&formSetting).Error; err != nil {
		return FormSetting{}, err
	}
	return formSetting, nil
}

// POST
// 作成
func (s FormSettingService) CreateFormSetting(db *gorm.DB, c echo.Context) (FormSetting, error) {
	formSetting := FormSetting{}
	if err := c.Bind(&formSetting); err != nil {
		return FormSetting{}, err
	}

	// もし既に同じform_idのform_settingが存在したら上書き
	var formSetting2 FormSetting
	if err := db.Where("form_id = ?", formSetting.FormID).First(&formSetting2).Error; err != nil {
		if err := db.Create(&formSetting).Error; err != nil {
			return FormSetting{}, err
		}
	} else {
		if err := db.Model(&formSetting2).Where("form_id = ?", formSetting.FormID).Updates(&formSetting).Error; err != nil {
			return FormSetting{}, err
		}
	}
	return formSetting, nil
}

// DELETE
// idを指定して削除
func (s FormSettingService) DeleteFormSettingById(db *gorm.DB, c echo.Context) error {
	id := c.Param("id")
	if err := db.Delete(&FormSetting{}, id).Error; err != nil {
		return err
	}
	return nil
}