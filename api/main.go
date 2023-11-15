package main

import (
	"github.com/YutoSekiguchi/nec-form-app/routers"
	"github.com/YutoSekiguchi/nec-form-app/util"
)

func main() {
	db := util.InitDb()
	router.InitRouter(db)
}