package db

import (
	"context"
	"fmt"
	"log"
	"os"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var client *mongo.Client

func Connect() {

	uri := os.Getenv("MONGODB_URI")

	// Use the SetServerAPIOptions() method to set the Stable API version to 1"
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)

	opts := options.Client().
		ApplyURI(uri).
		SetServerAPIOptions(serverAPI)

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

	EnsureUserIndexes()
}

func Stop() {
	log.Println("Gracefully shutting down MongoDB connection...")
	err := client.Disconnect(context.TODO())
	if err != nil {
		log.Fatal("Failed to disconnect from MongoDB:", err)
	}
	log.Println("Disconnected from MongoDB")
}
