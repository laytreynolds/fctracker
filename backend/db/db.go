package db

import (
	"context"
	"fmt"
	"log"
	"os"

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

func GetActivePlayers() []Player {
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
		panic(err)
	}

	return results
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
