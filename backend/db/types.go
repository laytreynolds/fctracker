package db

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type Player struct {
	Name          string        `bson:"name"`
	Age           string        `bson:"age"`
	Position      string        `bson:"position"`
	FunFact       string        `bson:"fun_fact"`
	Goals         int           `bson:"goals"`
	Assists       int           `bson:"assists"`
	GamesPlayed   int           `bson:"games_played"`
	ManOfTheMatch int           `bson:"man_of_the_match"`
	Active        bool          `bson:"active"`
	Created       string        `bson:"created"`
	TeamID        bson.ObjectID `bson:"team_id"`
}

type Team struct {
	Name    string          `bson:"name"`
	Coach   string          `bson:"coach"`
	Players []bson.ObjectID `bson:"players"` // List of Player IDs
	Founded string          `bson:"founded"`
	// Add more fields as needed
}

type Match struct {
	Date          time.Time       `bson:"date"`
	HomeTeam      string          `bson:"home_team"`
	AwayTeam      string          `bson:"away_team"`
	HomeScore     int             `bson:"home_score"`
	AwayScore     int             `bson:"away_score"`
	ManOfTheMatch bson.ObjectID   `bson:"man_of_the_match,omitempty"`
	Lineup        []bson.ObjectID `bson:"lineup"`
}

// In db/types.go or db/db.go
func newPlayer(name, position, funFact, age string) Player {
	return Player{
		Name:     name,
		Age:      age,
		Position: position,
		FunFact:  funFact,

		Goals:         0,    // default
		Assists:       0,    // default
		GamesPlayed:   0,    // default
		ManOfTheMatch: 0,    // default
		Active:        true, // default
		Created:       "",
	}
}

func newTeam(name, coach, founded string) Team {
	return Team{
		Name:    name,
		Coach:   coach,
		Founded: founded,
	}
}
