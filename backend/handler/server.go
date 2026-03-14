package handler

import (
	"context"
	"log"
	"net"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

const (
	timeout = 30 * time.Second
)

var (
	router = gin.Default()

	port = "9090"
	
	s *http.Server
	)

func Start() {
	initJWTSecret()

	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	

	allowedOrigins := []string{"http://localhost:5173"}
	if envOrigins := os.Getenv("ALLOWED_ORIGINS"); envOrigins != "" {
		origins := strings.Split(envOrigins, ",")
		for i, origin := range origins {
			origins[i] = strings.TrimSpace(origin)
		}
		allowedOrigins = origins
	}

	router.Use(func(c *gin.Context) {
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-Frame-Options", "DENY")
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")
		c.Next()
	})

	router.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	s = &http.Server{
		Addr:         ":" + port,
		Handler:      router,
		ReadTimeout:  timeout,
		WriteTimeout: timeout,
		IdleTimeout:  120 * time.Second,
	}
		
	// Health check (public)
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "healthy"})
	})

	// Auth routes (public)
	router.POST("/api/auth/login", login)
	router.POST("/api/auth/register", register)

	// All routes below require authentication
	api := router.Group("/api")
	api.Use(AuthMiddleware())

	// Authenticated user info
	api.GET("/auth/me", me)

	// Seed
	api.POST("/seed", seed)

	// Player
	api.GET("/player", getActivePlayers)
	api.GET("/player/:id", getPlayerByID)
	api.GET("/player/:id/fixtures", getPlayerFixtures)
	api.POST("/player/add", addPlayer)
	api.POST("/player/update", updatePlayer)
	api.DELETE("/player/delete", deletePlayer)

	// Teams
	api.POST("/team/add", addTeam)
	api.GET("/team/getbyid", getTeamById)
	api.GET("/team/getidbyname", getTeamIdByName)
	api.GET("/team/getall", getAllTeams)

	// Fixtures
	api.POST("/fixture/add", addFixture)
	api.GET("/fixture/getall", getFixtures)
	api.POST("/fixture/addgoalscorer", addGoalscorerToFixture)
	api.POST("/fixture/addassist", addAssistToFixture)
	api.POST("/fixture/addstat", addStatToFixture)
	api.GET("/fixture/:id", getFixtureByID)

	// Leaderboard
	api.GET("/leaderboard/goals", leaderboardGoals)
	api.GET("/leaderboard/assists", leaderboardAssists)
	api.GET("/leaderboard/motm", leaderboardMotm)
	api.GET("/leaderboard/fixtures", leaderboardFixtures)

	ln, err := net.Listen("tcp", ":"+port)
	if err != nil {
		log.Fatalf("Failed to listen on port %s: %v", port, err)
	}
	log.Printf("Server listening on port %s", port)
	log.Printf("Allowed origins: %v", allowedOrigins)

	go func() {
		if err := s.Serve(ln); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()
}

func Stop() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	log.Println("Gracefully shutting down server...")
	if err := s.Shutdown(ctx); err != nil {
		log.Fatalf("Failed to shutdown server: %v", err)
	}
	log.Println("Server gracefully shut down")
}
