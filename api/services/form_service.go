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
func (s FormService) Authenticate(authHeader string, db *gorm.DB, c echo.Context) (*Form, error) {
	// Authorizationヘッダが空または"Basic "で始まらない場合は認証エラー
	if authHeader == "" || !strings.HasPrefix(authHeader, "Basic ") {
		return nil, c.JSON(http.StatusUnauthorized, map[string]string{ 	
			"message":"Authentication Failed",
		})
	}

	// "Basic "を削除してBase64デコード
	authValue := strings.TrimPrefix(authHeader, "Basic ")
	decodedAuth, err := base64.StdEncoding.DecodeString(authValue)
	if err != nil {
		return nil, c.JSON(http.StatusUnauthorized, map[string]string{ 	
			"message":"Authentication Failed",
		})
	}

	appPass := string(decodedAuth)
	APP_PASS := os.Getenv("APP_PASS")
	if appPass != APP_PASS {
		return nil, c.JSON(http.StatusUnauthorized, map[string]string{
			"message": "Authentication Failed",
		})
	}
	return &Form{}, nil
}

// GET
// 全てのフォームの取得（逆順）
func (s FormService) GetAllForms(db *gorm.DB, c echo.Context) ([]Form, error) {
	authHeader := c.Request().Header.Get("Authorization")
	f, err := s.Authenticate(authHeader, db, c)
	if f == nil {
		return nil, err
	} else {
		var forms []Form
		if err := db.Order("created_at desc").Find(&forms).Error; err != nil {
			return nil, err
		}
		return forms, nil
	}
}

// idを指定してフォームの取得
func (s FormService) GetFormById(db *gorm.DB, c echo.Context) (Form, error) {
	authHeader := c.Request().Header.Get("Authorization")
	f, err := s.Authenticate(authHeader, db, c)
	if f == nil {
		return Form{}, err
	}

	id := c.Param("id")

	var form Form
	if err := db.First(&form, id).Error; err != nil {
		return Form{}, err
	}
	return form, nil
}


// TIDを指定してフォームの取得（逆順）
func (s FormService) GetFormByTID(db *gorm.DB, c echo.Context) ([]Form, error) {
	authHeader := c.Request().Header.Get("Authorization")
	f, err := s.Authenticate(authHeader, db, c)
	if f == nil {
		return nil, err
	}

	tid := c.Param("tid")

	// tidが一致するteamの名前一覧を取得
	var teamName Team
	if err := db.Where("id = ?", tid).First(&teamName).Error; err != nil {
		return nil, err
	}

	var teams []Team
	if err := db.Where("name = ?", teamName.Name).Find(&teams).Error; err != nil {
		return nil, err
	}

	// teamのnameが一致するteamのフォーム一覧を取得
	var forms []Form
	for _, team := range teams {
		var form []Form
		if err := db.Where("tid = ?", team.ID).Order("created_at desc").Find(&form).Error; err != nil {
			return nil, err
		}
		forms = append(forms, form...)
	}
	// formsをcreated_atが新しい順に並び替える
	for i := 0; i < len(forms); i++ {
		for j := i + 1; j < len(forms); j++ {
			if forms[i].CreatedAt.Before(forms[j].CreatedAt) {
				forms[i], forms[j] = forms[j], forms[i]
			}
		}
	}
	return forms, nil

	// var forms []Form
	// if err := db.Where("tid = ?", tid).Order("created_at desc").Find(&forms).Error; err != nil {
	// 	return nil, err
	// }
	// return forms, nil
}

// LongIDを指定してフォームの取得
func (s FormService) GetFormByLongID(db *gorm.DB, c echo.Context) (*Form, error) {
	authHeader := c.Request().Header.Get("Authorization")
	f, err := s.Authenticate(authHeader, db, c)
	if f == nil {
		return nil, err
	}
	
	longID := c.Param("longid")
	form := new(Form)
	if err := db.Where("long_id = ?", longID).Find(&form).Error; err != nil {
		return nil, err
	}
	return form, nil
}

// POST
// フォームの作成
func (s FormService) CreateForm(db *gorm.DB, c echo.Context) (Form, error) {
	authHeader := c.Request().Header.Get("Authorization")
	f, err := s.Authenticate(authHeader, db, c)
	if f == nil {
		return Form{}, err
	}

	form := Form{}
	if err := c.Bind(&form); err != nil {
		return Form{}, err
	}

	// もしすでに同じlong_idが存在したら上書きする
	var oldForm Form
	if err := db.Where("long_id = ?", form.LongID).Find(&oldForm).Error; err != nil {
		return Form{}, err
	}
	if oldForm.ID != 0 {
		form.ID = oldForm.ID
		if err := db.Model(&form).Where("id = ?", form.ID).Updates(&form).Error; err != nil {
			return Form{}, err
		}
		return form, nil
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
	f, err := s.Authenticate(authHeader, db, c)
	if f == nil {
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
	f, err := s.Authenticate(authHeader, db, c)
	if f == nil {
		return err
	}

	id := c.Param("id")

	if err := db.Delete(&Form{}, id).Error; err != nil {
		return err
	}
	return nil
}
