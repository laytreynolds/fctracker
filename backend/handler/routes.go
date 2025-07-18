package handler

import (
	"net/http"

	"fctracker/db"

	"github.com/gin-gonic/gin"
)

func getActivePlayers(c *gin.Context) {
	players := db.GetActivePlayers()

	if len(players) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"Error": "no players found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"players": players,
	})
}

func dbInit(c *gin.Context) {
	db.Init()
}

func addPlayer(c *gin.Context) {

	name := c.Query("name")
	age := c.Query("age")
	position := c.Query("position")
	fact := c.Query("fact")

	response, err := db.AddPlayer(name, position, fact, age)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"Error": err,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"player": response,
	})
}

func updatePlayer(c *gin.Context) {
	id := c.Query("id")

	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"Error": "missing id query parameter",
		})
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
		c.JSON(http.StatusBadRequest, gin.H{"Error": "no fields to update"})
		return
	}

	// Call a db function to update the player
	result, err := db.UpdatePlayerByID(id, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"result": result})
}

func getPlayerByName(c *gin.Context) {
	name := c.Query("name")

	if name == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"Error": "missing name query parameter",
		})
		return
	}

	player, err := db.GetPlayerByName(name)

	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"Error": "no players found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"players": player,
	})
}
