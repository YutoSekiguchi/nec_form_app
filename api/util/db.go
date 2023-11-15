package util

import (
	"fmt"
	"os"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var Db *gorm.DB

func InitDb() *gorm.DB {
	USER := os.Getenv("MYSQL_USER")
	PASS := os.Getenv("MYSQL_PASSWORD")
	PROTOCOL := os.Getenv("MYSQL_HOST")
	DBNAME := os.Getenv("MYSQL_DATABASE")

	CONNECT := USER + ":" + PASS + "@" + PROTOCOL + "/" + DBNAME + "?parseTime=true"

	dialector := mysql.Open(CONNECT)

	Db, err := gorm.Open(dialector, &gorm.Config{})
	if err != nil {
		WaitConnect(dialector, 100)
	}
	Db.Set("gorm:table_options", "ENGINE=InnoDB")

	return Db
}

func WaitConnect(dialector gorm.Dialector, count uint) {
	var err error
	if Db, err = gorm.Open(dialector); err != nil {
		if count > 1 {
			time.Sleep(time.Second * 2)
			count--
			fmt.Println("retry_count: ", 100-count)
			WaitConnect(dialector, count)
			return
		}
		panic(err.Error())
	}
}