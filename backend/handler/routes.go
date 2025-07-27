package handler

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

const (
	timeout = 30 * time.Second
)

var (
	router = gin.Default()
)

func Start() {
	// Set Gin to release mode in production
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	allowedOrigins := []string{"http://localhost:5173"}
	if envOrigins := os.Getenv("ALLOWED_ORIGINS"); envOrigins != "" {
		origins := strings.Split(envOrigins, ",")
		for i, origin := range origins {
			origins[i] = strings.TrimSpace(origin)
		}
		allowedOrigins = origins
	}

	router.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// init
	router.POST("/api/seed", seed)

	// Player
	router.GET("/api/player", getActivePlayers)
	router.POST("/api/player/add", addPlayer)
	router.POST("/api/player/update", updatePlayer)
	router.DELETE("api/player/delete", deletePlayer)

	// Teams
	router.POST("/api/team/add", addTeam)
	router.GET("/api/team/getbyid", getTeamById)
	router.GET("/api/team/getidbyname", getTeamIdByName)
	router.GET("/api/team/getall", getAllTeams)

	// Fixtures
	router.POST("/api/fixture/add", addFixture)
	router.GET("/api/fixture/getall", getFixtures)
	router.POST("/api/fixture/addgoalscorer", addGoalscorerToFixture)
	router.POST("/api/fixture/addstat", addStatToFixture)
	router.GET("/api/fixture/:id", getFixtureByID)

	// Leaderboard
	router.GET("/api/leaderboard/goals", leaderboardGoals)
	router.GET("/api/leaderboard/assists", leaderboardAssists)
	router.GET("/api/leaderboard/motm", leaderboardMotm)
	router.GET("/api/leaderboard/fixtures", leaderboardFixtures)

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "healthy"})
	})

	s := &http.Server{
		Addr:         ":" + port,
		Handler:      router,
		ReadTimeout:  timeout,
		WriteTimeout: timeout,
		IdleTimeout:  120 * time.Second,
	}

	// Start server in a goroutine
	go func() {
		log.Printf("Server starting on port %s", port)
		log.Printf("Allowed origins: %v", allowedOrigins)
		if err := s.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	// Create a deadline for server shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := s.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exited")
}
