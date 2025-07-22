package db

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

const (
	format = "2006-01-02T15:04:05.000Z"
)

type Player struct {
	ID            bson.ObjectID `bson:"_id,omitempty"`
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
	TeamName      string        `bson:"team_name,omitempty"`
}

type Team struct {
	ID      bson.ObjectID   `bson:"_id,omitempty"`
	Name    string          `bson:"name"`
	Coach   string          `bson:"coach"`
	Players []bson.ObjectID `bson:"players"` // List of Player IDs
	Founded string          `bson:"founded"`
	Created string          `bson:"created"`
}

type Fixture struct {
	ID                 bson.ObjectID   `bson:"_id,omitempty"`
	Date               string          `bson:"date"`
	HomeTeam           string          `bson:"home_team"`
	AwayTeam           string          `bson:"away_team"`
	HomeScore          string          `bson:"home_score"`
	AwayScore          string          `bson:"away_score"`
	ManOfTheMatch      bson.ObjectID   `bson:"man_of_the_match,omitempty"`
	Lineup             []bson.ObjectID `bson:"lineup"`
	ManOfTheMatchName  string          `bson:"man_of_the_match_name,omitempty"`
	GoalScorers        []bson.ObjectID `bson:"goal_scorers,omitempty"`
	GoalScorersNames   []string        `bson:"goal_scorers_names,omitempty"`
	AssistScorers      []bson.ObjectID `bson:"assist_scorers,omitempty"`
	AssistScorersNames []string        `bson:"assist_scorers_names,omitempty"`
}

// In db/types.go or db/db.go
func newPlayer(name, position, funFact, age string, teamId bson.ObjectID) Player {
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
		Created:       time.Now().Format(format),
		TeamID:        teamId,
	}
}

func newTeam(name, coach, founded string) Team {
	return Team{
		Name:    name,
		Coach:   coach,
		Founded: founded,
		Created: time.Now().Format(format),
	}
}

func newFixture(date, homeTeam, awayTeam, homeScore, awayScore string, manOfTheMatch bson.ObjectID) Fixture {
	return Fixture{
		Date:          date,
		HomeTeam:      homeTeam,
		AwayTeam:      awayTeam,
		HomeScore:     homeScore,
		AwayScore:     awayScore,
		ManOfTheMatch: manOfTheMatch,
	}
}
