package handler

import (
	"net/http"

	"fctracker/db"

	"github.com/gin-gonic/gin"
)

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

func seed(c *gin.Context) {
	db.SeedPlayers()
}

func addPlayer(c *gin.Context) {

	name := c.Query("name")
	age := c.Query("age")
	position := c.Query("position")
	fact := c.Query("fact")

	response, err := db.AddPlayer(name, position, fact, age)
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
