package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"fctracker/db"
	"fctracker/handler"

	"github.com/joho/godotenv"
)

const (
	port    = ":8080"
	timeout = 30 * time.Second
)

func main() {

	// Load signals
	signals := make(chan os.Signal, 1)

	// load env
	if err := godotenv.Load(); err != nil {
		log.Fatalf("error loading env: %s", err)
	}

	uri, ok := os.LookupEnv("MONGODB_URI")
	if !ok {
		log.Fatalf("env variable does not exist")
	}

	// Connect DB
	db.URI = uri
	db.Connect()

	http.HandleFunc("/api/home", handler.Home)

	s := &http.Server{
		Addr:         port,
		Handler:      http.DefaultServeMux,
		ReadTimeout:  timeout,
		WriteTimeout: timeout,
	}

	// Start the server
	go func() {
		if err := s.ListenAndServe(); err != http.ErrServerClosed {
			log.Fatal(err)
		}
	}()

	<-signals
}
