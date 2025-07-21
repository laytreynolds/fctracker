package db

import (
	"context"
	"fmt"
	"log"
	"os"
	"strconv"

	"math/rand"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var (
	URI    string
	client *mongo.Client
)

const (
	db      = "fctracker"
	players = "players"
	teams   = "teams"
)

func Connect() {

	// load env
	if err := godotenv.Load(); err != nil {
		log.Fatalf("error loading env: %s", err)
	}

	uri := os.Getenv("MONGODB_URI")

	// Use the SetServerAPIOptions() method to set the Stable API version to 1
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(uri).SetServerAPIOptions(serverAPI)

	// Create a new client and connect to the server
	var err error
	client, err = mongo.Connect(opts)

	if err != nil {
		log.Fatal(err)
	}

	// Send a ping to confirm a successful connection
	var result bson.M
	if err := client.Database("admin").RunCommand(context.TODO(), bson.D{{"ping", 1}}).Decode(&result); err != nil {
		log.Fatal(err)
	}
	fmt.Println("connected to MongoDB...")
}

func GetActivePlayers() ([]Player, error) {
	coll := client.Database(db).Collection(players)

	pipeline := mongo.Pipeline{
		{{"$match", bson.D{{"active", true}}}},
		{{"$lookup", bson.D{
			{"from", "teams"},
			{"localField", "team_id"},
			{"foreignField", "_id"},
			{"as", "teamDetails"},
		}}},
		{{"$unwind", "$teamDetails"}},
		{{"$addFields", bson.D{
			{"team_name", "$teamDetails.name"},
		}}},
		{{"$project", bson.D{
			{"teamDetails", 0},
		}}},
	}

	cursor, err := coll.Aggregate(context.TODO(), pipeline)
	if err != nil {
		return nil, err
	}

	var results []Player
	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}

	return results, nil
}

func AddPlayer(name, position, fact, age, teamID string) (Player, error) {
	coll := client.Database(db).Collection(players)

	// Get team from name
	objID, err := bson.ObjectIDFromHex(teamID)
	if err != nil {
		return Player{}, err
	}

	player := newPlayer(name, position, fact, age, objID)

	_, err = coll.InsertOne(context.TODO(), player)
	if err != nil {
		return player, err
	}

	return player, nil
}

func UpdatePlayerByID(id string, update map[string]any) (any, error) {
	coll := client.Database(db).Collection(players)
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	filter := bson.D{{"_id", objID}}
	updateDoc := bson.M{"$set": update}

	result, err := coll.UpdateOne(context.TODO(), filter, updateDoc)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func DeletePlayer(id string) error {
	coll := client.Database(db).Collection(players)
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return err
	}
	filter := bson.D{{"_id", objID}}

	// Check if player exists
	var result Player
	err = coll.FindOne(context.TODO(), filter).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return fmt.Errorf("player not found")
		}
		return err
	}

	// Player exists, proceed to delete
	_, err = coll.DeleteOne(context.TODO(), filter)
	if err != nil {
		return err
	}
	return nil
}

func SeedPlayers() error {
	collPlayers := client.Database(db).Collection(players)
	collTeams := client.Database(db).Collection(teams)

	// Create a team
	team := Team{
		Name:    "Seeded FC",
		Coach:   "Coach Random",
		Players: []bson.ObjectID{},
		Founded: "2024",
	}
	teamResult, err := collTeams.InsertOne(context.TODO(), team)
	if err != nil {
		return err
	}
	teamID := teamResult.InsertedID.(bson.ObjectID)

	names := []string{"Alex", "Jamie", "Chris", "Taylor", "Jordan", "Morgan", "Casey", "Riley", "Drew", "Sam"}
	positions := []string{"GK", "CB", "LB", "RB", "CM", "CDM", "CAM", "LW", "RW", "ST"}
	funFacts := []string{"Loves pizza", "Can juggle", "Fastest runner", "Team joker", "Plays guitar", "Chess champion", "Speaks 3 languages", "Has a pet snake", "Never late", "Wears lucky socks"}

	var playerIDs []bson.ObjectID
	for i := 0; i < 10; i++ {
		age := rand.Intn(10) + 18 // 18-27
		player := Player{
			Name:          names[i%len(names)],
			Age:           strconv.Itoa(age),
			Position:      positions[i%len(positions)],
			FunFact:       funFacts[i%len(funFacts)],
			Goals:         rand.Intn(20),
			Assists:       rand.Intn(10),
			GamesPlayed:   rand.Intn(30) + 1,
			ManOfTheMatch: rand.Intn(5),
			Active:        true,
			TeamID:        teamID,
		}
		res, err := collPlayers.InsertOne(context.TODO(), player)
		if err != nil {
			return err
		}
		playerIDs = append(playerIDs, res.InsertedID.(bson.ObjectID))
	}

	// Optionally update the team with the player IDs
	_, err = collTeams.UpdateByID(context.TODO(), teamID, bson.M{"$set": bson.M{"players": playerIDs}})
	if err != nil {
		return err
	}

	return nil
}

func AddTeam(name, coach, founded string) (Team, error) {
	coll := client.Database(db).Collection(teams)

	team := newTeam(name, coach, founded)

	_, err := coll.InsertOne(context.TODO(), team)
	if err != nil {
		return team, err
	}

	return team, nil
}

func GetTeamById(id string) (Team, error) {
	var result Team

	coll := client.Database(db).Collection(teams)
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return result, err
	}
	filter := bson.D{{"_id", objID}}

	// Check if team exists
	err = coll.FindOne(context.TODO(), filter).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return result, fmt.Errorf("player not found")
		}
		return result, err
	}
	return result, nil
}

func GetAllTeams() ([]Team, error) {
	coll := client.Database(db).Collection(teams)

	filter := bson.D{}

	cursor, err := coll.Find(context.TODO(), filter)
	if err != nil {
		return nil, err
	}

	var results []Team
	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}

	return results, nil
}

func GetTeamByName(name string) (Team, error) {
	var result Team

	coll := client.Database(db).Collection(teams)

	filter := bson.D{{"name", name}}

	// Check if team exists
	err := coll.FindOne(context.TODO(), filter).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return result, fmt.Errorf("team not found")
		}
		return result, err
	}
	return result, nil
}
