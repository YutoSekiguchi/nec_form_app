package services

import (
	"encoding/base64"
	"net/http"
	"os"
	"strings"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type FormService struct {}

// 認証機能の追加
func (s FormService) Authenticate(authHeader string, db *gorm.DB, c echo.Context) error {
	// Authorizationヘッダが空または"Basic "で始まらない場合は認証エラー
	if authHeader == "" || !strings.HasPrefix(authHeader, "Basic ") {
		return c.JSON(http.StatusUnauthorized, map[string]string{ 	
			"message":"Authentication Failed",
		})
	}

	// "Basic "を削除してBase64デコード
	authValue := strings.TrimPrefix(authHeader, "Basic ")
	decodedAuth, err := base64.StdEncoding.DecodeString(authValue)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{ 	
			"message":"Authentication Failed",
		})
	}

	appPass := string(decodedAuth)
	APP_PASS := os.Getenv("APP_PASS")
	if appPass != APP_PASS {
		return c.JSON(http.StatusUnauthorized, map[string]string{
			"message": "Authentication Failed",
		})
	}
	return nil
}

// GET
// 全てのフォームの取得
func (s FormService) GetAllForms(db *gorm.DB, c echo.Context) ([]Form, error) {
	authHeader := c.Request().Header.Get("Authorization")
	if err := s.Authenticate(authHeader, db, c); err != nil {
		return nil, err
	}

	var forms []Form
	if err := db.Find(&forms).Error; err != nil {
		return nil, err
	}
	return forms, nil
}

// idを指定してフォームの取得
func (s FormService) GetFormById(db *gorm.DB, c echo.Context) (Form, error) {
	authHeader := c.Request().Header.Get("Authorization")
	if err := s.Authenticate(authHeader, db, c); err != nil {
		return Form{}, err
	}

	id := c.Param("id")

	var form Form
	if err := db.First(&form, id).Error; err != nil {
		return Form{}, err
	}
	return form, nil
}

// TIDを指定してフォームの取得
func (s FormService) GetFormByTID(db *gorm.DB, c echo.Context) ([]Form, error) {
	authHeader := c.Request().Header.Get("Authorization")
	if err := s.Authenticate(authHeader, db, c); err != nil {
		return nil, err
	}

	tid := c.Param("tid")
	var forms []Form
	if err := db.Where("tid = ?", tid).Find(&forms).Error; err != nil {
		return nil, err
	}
	return forms, nil
}

// LongIDを指定してフォームの取得
func (s FormService) GetFormByLongID(db *gorm.DB, c echo.Context) (Form, error) {
	authHeader := c.Request().Header.Get("Authorization")
	if err := s.Authenticate(authHeader, db, c); err != nil {
		return Form{}, err
	}
	
	longID := c.Param("longID")
	var form Form
	if err := db.Where("long_id = ?", longID).Find(&form).Error; err != nil {
		return Form{}, err
	}
	return form, nil
}

// POST
// フォームの作成
func (s FormService) CreateForm(db *gorm.DB, c echo.Context) (Form, error) {
	authHeader := c.Request().Header.Get("Authorization")
	if err := s.Authenticate(authHeader, db, c); err != nil {
		return Form{}, err
	}

	form := Form{}
	if err := c.Bind(&form); err != nil {
		return Form{}, err
	}
	if err := db.Create(&form).Error; err != nil {
		return Form{}, err
	}
	return form, nil
}

// PUT
// idを指定してフォームの更新
func (s FormService) UpdateFormById(db *gorm.DB, c echo.Context) (Form, error) {
	authHeader := c.Request().Header.Get("Authorization")
	if err := s.Authenticate(authHeader, db, c); err != nil {
		return Form{}, err
	}

	form := Form{}
	if err := c.Bind(&form); err != nil {
		return Form{}, err
	}

	id := c.Param("id")
	if err := db.Model(&form).Where("id = ?", id).Updates(&form).Error; err != nil {
		return Form{}, err
	}
	return form, nil
}

// DELETE
// idを指定してフォームの削除
func (s FormService) DeleteFormById(db *gorm.DB, c echo.Context) error {
	authHeader := c.Request().Header.Get("Authorization")
	if err := s.Authenticate(authHeader, db, c); err != nil {
		return err
	}

	id := c.Param("id")

	if err := db.Delete(&Form{}, id).Error; err != nil {
		return err
	}
	return nil
}
