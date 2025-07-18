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
