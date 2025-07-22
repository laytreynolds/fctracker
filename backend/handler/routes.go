package handler

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
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

	router.Use(cors.Default())

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
	router.POST("/api/fixture/addassist", addAssistToFixture)
	router.GET("/api/fixture/:id", getFixtureByID)

	// Leaderboard
	router.GET("/api/leaderboard/goals", leaderboardGoals)
	router.GET("/api/leaderboard/assists", leaderboardAssists)
	router.GET("/api/leaderboard/motm", leaderboardMotm)
	router.GET("/api/leaderboard/fixtures", leaderboardFixtures)

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
