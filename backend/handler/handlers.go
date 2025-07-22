package handler

import (
	"net/http"

	"fctracker/db"

	"github.com/gin-gonic/gin"
)

// DB init
func seed(c *gin.Context) {
	db.SeedPlayers()
}

// PLayer Handlers
func getActivePlayers(c *gin.Context) {
	players, err := db.GetActivePlayers()
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"mesage": "error getting active players", "error": "no players found"})
	}

	if len(players) == 0 {
		c.JSON(http.StatusOK, gin.H{"mesage": "error getting active players", "error": "no players found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"players": players, "error": ""})
}

func addPlayer(c *gin.Context) {
	name := c.Query("name")
	age := c.Query("age")
	position := c.Query("position")
	fact := c.Query("fact")
	teamName := c.Query("team")

	// Get Team ID from name
	team, err := db.GetTeamByName(teamName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "error finding team", "error": err.Error()})
		return
	}

	response, err := db.AddPlayer(name, position, fact, age, team.ID.Hex())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"mesage": "error adding player", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"player": response, "error": ""})
}

func updatePlayer(c *gin.Context) {
	id := c.Query("id")

	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"mesage": "error updating player", "error": "missing id query parameter"})
		return
	}

	// Get all query params
	params := c.Request.URL.Query()
	update := make(map[string]any)

	// List of updatable fields
	allowed := map[string]bool{
		"name":             true,
		"age":              true,
		"position":         true,
		"fun_fact":         true,
		"goals":            true,
		"assists":          true,
		"games_played":     true,
		"man_of_the_match": true,
		"active":           true,
	}

	for key, values := range params {
		if key == "id" {
			continue // don't update the id
		}
		if allowed[key] && len(values) > 0 {
			update[key] = values[0]
		}
	}

	if len(update) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"mesage": "error updating player", "error": "no fields to update"})
		return
	}

	// Call a db function to update the player
	result, err := db.UpdatePlayerByID(id, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "error updating player", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"result": result, "error": ""})
}

func deletePlayer(c *gin.Context) {
	id := c.Query("id")

	err := db.DeletePlayer(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "error deleting player", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "player deleted", "error": ""})

}

// Team Handlers
func addTeam(c *gin.Context) {
	name := c.Query("name")
	coach := c.Query("coach")
	founded := c.Query("founded")

	team, err := db.AddTeam(name, coach, founded)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "error adding team", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "team added", "team": team, "error": ""})
}

func getTeamById(c *gin.Context) {
	id := c.Query("id")

	team, err := db.GetTeamById(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "error getting team", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "team found", "team": team, "error": ""})
}

func getTeamIdByName(c *gin.Context) {
	name := c.Query("name")

	team, err := db.GetTeamByName(name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "error getting team", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "team found", "team_id": team.ID.Hex(), "error": ""})
}

func getAllTeams(c *gin.Context) {
	teams, err := db.GetAllTeams()
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"mesage": "error getting teams", "error": "no teams found"})
	}

	if len(teams) == 0 {
		c.JSON(http.StatusOK, gin.H{"mesage": "error getting teams", "error": "no teams found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"teams": teams, "error": ""})
}

func addFixture(c *gin.Context) {
	date := c.Query("date")
	homeTeam := c.Query("homeTeam")
	awayTeam := c.Query("awayTeam")
	homeScore := c.Query("homeScore")
	awayScore := c.Query("awayScore")
	manOfMatch := c.Query("manOfTheMatch")

	fixture, err := db.AddFixture(date, homeTeam, awayTeam, homeScore, awayScore, manOfMatch)
	if err != nil {
		if err != nil {
			c.JSON(http.StatusOK, gin.H{"mesage": "error adding fixture", "error": err})
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "fixture added", "fixture": fixture, "error": ""})
}

func getFixtures(c *gin.Context) {
	fixtures, err := db.GetFixtures()
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"mesage": "error getting active players", "error": "no players found"})
	}

	c.JSON(http.StatusOK, gin.H{"fixtures": fixtures, "error": ""})
}

func getFixtureByID(c *gin.Context) {
	id := c.Param("id")
	fixture, err := db.GetFixtureByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Fixture not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"fixture": fixture})
}

func leaderboardGoals(c *gin.Context) {
	players, err := db.GetLeaderboard("goals")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"players": players})
}

func leaderboardAssists(c *gin.Context) {
	players, err := db.GetLeaderboard("assists")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"players": players})
}

func leaderboardMotm(c *gin.Context) {
	players, err := db.GetLeaderboard("man_of_the_match")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"players": players, "error": ""})
}

func leaderboardFixtures(c *gin.Context) {
	fixtures, err := db.GetLeaderboardFixtures()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"fixtures": fixtures, "error": ""})
}

func addGoalscorerToFixture(c *gin.Context) {
	fixtureID := c.Query("fixtureId")
	playerID := c.Query("playerId")

	if fixtureID == "" || playerID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing fixtureId or playerId"})
		return
	}

	updated, err := db.AddGoalscorerToFixture(fixtureID, playerID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
		return
	}

	c.JSON(http.StatusOK, gin.H{"fixture": updated})
}
