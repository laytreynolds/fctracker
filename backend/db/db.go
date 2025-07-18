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

func Init() {
	coll := client.Database(db).Collection(players)
	newPlayer := newPlayer("Layton", "CB", "Speaks weird", "27")

	_, err := coll.InsertOne(context.TODO(), newPlayer)
	if err != nil {
		panic(err)
	}
}

func GetActivePlayers() ([]Player, error) {
	coll := client.Database(db).Collection(players)

	filter := bson.D{{"active", true}}

	// Retrieves documents that match the query filter
	cursor, err := coll.Find(context.TODO(), filter)
	if err != nil {
		panic(err)
	}

	// Unpacks the cursor into a slice
	var results []Player
	if err = cursor.All(context.TODO(), &results); err != nil {
		return results, err
	}

	return results, nil
	// end find
}

func AddPlayer(name, position, fact, age string) (Player, error) {
	coll := client.Database(db).Collection(players)
	player := newPlayer(name, position, fact, age)

	_, err := coll.InsertOne(context.TODO(), player)
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
