package db

type Player struct {
	Name          string `bson:"name"`
	Age           string `bson:"age"`
	Position      string `bson:"position"`
	FunFact       string `bson:"fun_fact"`
	Goals         int    `bson:"goals"`
	Assists       int    `bson:"assists"`
	GamesPlayed   int    `bson:"games_played"`
	ManOfTheMatch int    `bson:"man_of_the_match"`
	Active        bool   `bson:"active"`
	Created       string `bson:"created"`
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
