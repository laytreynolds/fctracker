package main

import (
	"context"
	"fctracker/db"
	"fctracker/handler"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/joho/godotenv"
)

func main() {

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	err := godotenv.Load()
	if err != nil {
		log.Printf("Error loading .env file: %v", err)
	}

	go db.Connect()
	go handler.Start(ctx)

	<-quit
	handler.Stop(ctx)
	db.Stop()
}
