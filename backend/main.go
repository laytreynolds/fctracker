package main

import (
	"fctracker/db"
	"fctracker/handler"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Printf("Error loading .env file: %v", err)
	}

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	

	db.Connect()
	handler.Start()

	<-quit

	handler.Stop()
	db.Stop()

	log.Println("Server stopped")
}
