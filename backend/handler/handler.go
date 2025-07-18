package handler

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

const (
	port    = ":8080"
	timeout = 30 * time.Second
)

var (
	router = gin.Default()
)

func Start() {

	router.POST("/api/seed", seed)

	// Player routes
	router.GET("/api/player", getActivePlayers)
	router.POST("/api/player/add", addPlayer)
	router.POST("/api/player/update", updatePlayer)
	router.DELETE("api/player/delete", deletePlayer)

	router.POST("/api/team/add", addTeam)

	s := &http.Server{
		Addr:         port,
		Handler:      router,
		ReadTimeout:  timeout,
		WriteTimeout: timeout,
	}

	// Start the server

	go func() {
		if err := s.ListenAndServe(); err != http.ErrServerClosed {
			log.Fatal(err)
		}
	}()
}
