package main

import (
	"os"

	"fctracker/db"
	"fctracker/handler"
)

func main() {

	// Load signals
	signals := make(chan os.Signal, 1)

	db.Connect()

	handler.Start()

	<-signals
}
