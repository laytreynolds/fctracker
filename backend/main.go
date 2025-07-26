package main

import (
	"fctracker/db"
	"fctracker/handler"
)

func main() {

	db.Connect()

	handler.Start()
}
