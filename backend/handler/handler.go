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

	router.GET("/api/init", dbInit)

	// Player routes
	router.GET("/api/players", getActivePlayers)
	router.GET("/api/getplayer", getPlayerByName)

	router.POST("/api/addplayer", addPlayer)
	router.POST("/api/updateplayer", updatePlayer)

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
