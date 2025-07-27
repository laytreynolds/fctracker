package db

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"os"
	"strconv"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var (
	URI    string
	client *mongo.Client
)

const (
	db       = "fctracker"
	players  = "players"
	teams    = "teams"
	fixtures = "fixtures"
)

func Connect() {

	uri := os.Getenv("MONGODB_URI")

	// Use the SetServerAPIOptions() method to set the Stable API version to 1
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)

	// Configure client options with proper TLS settings for production / development
	var opts *options.ClientOptions
	if os.Getenv("GIN_MODE") == "release" {
		opts = options.Client().
			ApplyURI(uri).
			SetServerAPIOptions(serverAPI).
			SetTLSConfig(nil)
	} else {
		opts = options.Client().
			ApplyURI(uri).
			SetServerAPIOptions(serverAPI)
	}

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

func AddFixture(date, homeTeam, awayTeam, homeScore, awayScore, manOfTheMatch, latitude, longitude string) (Fixture, error) {
	var result Fixture

	coll := client.Database(db).Collection(fixtures)

	motmId, err := bson.ObjectIDFromHex(manOfTheMatch)
	if err != nil {
		return result, err
	}

	result = newFixture(date, homeTeam, awayTeam, homeScore, awayScore, motmId)

	// Add location if coordinates are provided
	if latitude != "" && longitude != "" {
		lat, err := strconv.ParseFloat(latitude, 64)
		if err == nil {
			lon, err := strconv.ParseFloat(longitude, 64)
			if err == nil {
				result.Location = Location{
					Latitude:  lat,
					Longitude: lon,
				}
			}
		}
	}

	_, err = coll.InsertOne(context.TODO(), result)
	if err != nil {
		return result, err
	}

	return result, nil
}

func GetFixtures() ([]Fixture, error) {
	coll := client.Database(db).Collection(fixtures)

	pipeline := mongo.Pipeline{
		{{"$lookup", bson.D{
			{"from", "players"},
			{"localField", "man_of_the_match"},
			{"foreignField", "_id"},
			{"as", "motmDetails"},
		}}},
		{{"$addFields", bson.D{
			{"man_of_the_match_name", bson.D{
				{"$arrayElemAt", bson.A{"$motmDetails.name", 0}},
			}},
		}}},
		{{"$project", bson.D{
			{"motmDetails", 0},
		}}},
	}

	cursor, err := coll.Aggregate(context.TODO(), pipeline)
	if err != nil {
		return nil, err
	}

	var results []Fixture
	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}

	return results, nil
}

func GetFixtureByID(id string) (Fixture, error) {
	var result Fixture
	coll := client.Database(db).Collection(fixtures)
	objID, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return result, err
	}

	pipeline := mongo.Pipeline{
		{{"$match", bson.D{{"_id", objID}}}},
		{{"$lookup", bson.D{
			{"from", "players"},
			{"localField", "man_of_the_match"},
			{"foreignField", "_id"},
			{"as", "motmDetails"},
		}}},
		{{"$addFields", bson.D{
			{"man_of_the_match_name", bson.D{
				{"$arrayElemAt", bson.A{"$motmDetails.name", 0}},
			}},
		}}},
		{{"$project", bson.D{
			{"motmDetails", 0},
		}}},
	}

	cursor, err := coll.Aggregate(context.TODO(), pipeline)
	if err != nil {
		return result, err
	}
	var fixtures []Fixture
	if err = cursor.All(context.TODO(), &fixtures); err != nil {
		return result, err
	}
	if len(fixtures) == 0 {
		return result, fmt.Errorf("fixture not found")
	}
	return fixtures[0], nil
}

func GetLeaderboard(stat string) ([]Player, error) {
	coll := client.Database(db).Collection(players)
	opts := options.Find().SetSort(bson.D{{stat, -1}}).SetLimit(5)
	cursor, err := coll.Find(context.TODO(), bson.D{}, opts)
	if err != nil {
		return nil, err
	}
	var results []Player
	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}
	return results, nil
}

func GetLeaderboardFixtures() ([]Fixture, error) {
	coll := client.Database(db).Collection(fixtures)

	pipeline := mongo.Pipeline{
		{{"$lookup", bson.D{
			{"from", "players"},
			{"localField", "man_of_the_match"},
			{"foreignField", "_id"},
			{"as", "motmDetails"},
		}}},
		{{"$addFields", bson.D{
			{"man_of_the_match_name", bson.D{
				{"$arrayElemAt", bson.A{"$motmDetails.name", 0}},
			}},
		}}},
		{{"$project", bson.D{
			{"motmDetails", 0},
		}}},
		{{"$sort", bson.D{{"date", -1}}}},
		{{"$limit", 5}},
	}

	cursor, err := coll.Aggregate(context.TODO(), pipeline)
	if err != nil {
		return nil, err
	}

	var results []Fixture
	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}
	return results, nil
}

// 1. Add goalscorer to fixture
func AddGoalscorerToFixtureOnly(fixtureID, playerID string) error {
	collFixtures := client.Database(db).Collection(fixtures)
	collPlayers := client.Database(db).Collection(players)

	fixtureObjID, err := bson.ObjectIDFromHex(fixtureID)
	if err != nil {
		return err
	}
	playerObjID, err := bson.ObjectIDFromHex(playerID)
	if err != nil {
		return err
	}

	// Get player name
	var player Player
	err = collPlayers.FindOne(context.TODO(), bson.M{"_id": playerObjID}).Decode(&player)
	if err != nil {
		return err
	}

	update := bson.M{
		"$push": bson.M{
			"goal_scorers":       playerObjID,
			"goal_scorers_names": player.Name,
		},
	}

	_, err = collFixtures.UpdateOne(
		context.TODO(),
		bson.M{"_id": fixtureObjID},
		update,
	)
	return err
}

// 2. Count player goals
func CountPlayerGoals(playerObjID bson.ObjectID) (int64, error) {
	collFixtures := client.Database(db).Collection(fixtures)

	pipeline := mongo.Pipeline{
		{{"$project", bson.D{
			{"count", bson.D{
				{"$size", bson.D{
					{"$filter", bson.D{
						{"input", bson.D{{"$ifNull", bson.A{"$goal_scorers", bson.A{}}}}},
						{"as", "scorer"},
						{"cond", bson.D{{"$eq", bson.A{"$$scorer", playerObjID}}}},
					}},
				}},
			}},
		}}},
		{{"$group", bson.D{
			{"_id", nil},
			{"total", bson.D{{"$sum", "$count"}}},
		}}},
	}

	cursor, err := collFixtures.Aggregate(context.TODO(), pipeline)
	if err != nil {
		return 0, err
	}
	defer cursor.Close(context.TODO())

	var result struct {
		Total int64 `bson:"total"`
	}
	if cursor.Next(context.TODO()) {
		if err := cursor.Decode(&result); err != nil {
			return 0, err
		}
		return result.Total, nil
	}
	return 0, nil
}

// 3. Update player goals field
func UpdatePlayerGoalsField(playerObjID bson.ObjectID, count int64) error {
	collPlayers := client.Database(db).Collection(players)
	_, err := collPlayers.UpdateOne(
		context.TODO(),
		bson.M{"_id": playerObjID},
		bson.M{"$set": bson.M{"goals": count}},
	)
	return err
}

// 4. Coordinator
func AddGoalscorerToFixture(fixtureID, playerID string) (Fixture, error) {
	// Add goalscorer to fixture
	err := AddGoalscorerToFixtureOnly(fixtureID, playerID)
	if err != nil {
		return Fixture{}, err
	}

	// Convert playerID to ObjectID
	playerObjID, err := bson.ObjectIDFromHex(playerID)
	if err != nil {
		return Fixture{}, err
	}

	// Count goals
	count, err := CountPlayerGoals(playerObjID)
	if err != nil {
		return Fixture{}, err
	}

	// Update player goals field
	err = UpdatePlayerGoalsField(playerObjID, count)
	if err != nil {
		return Fixture{}, err
	}

	// Return the updated fixture (refetch as needed)
	return GetFixtureByID(fixtureID)
}

// 1. Add assis to fixture
func AddStatToFixtureOnly(fixtureID, playerID, stat string) error {
	collFixtures := client.Database(db).Collection(fixtures)
	collPlayers := client.Database(db).Collection(players)

	fixtureObjID, err := bson.ObjectIDFromHex(fixtureID)
	if err != nil {
		return err
	}
	playerObjID, err := bson.ObjectIDFromHex(playerID)
	if err != nil {
		return err
	}

	// Get player name
	var player Player
	err = collPlayers.FindOne(context.TODO(), bson.M{"_id": playerObjID}).Decode(&player)
	if err != nil {
		return err
	}

	update := bson.M{
		"$push": bson.M{
			stat:            playerObjID,
			stat + "_names": player.Name,
		},
	}

	_, err = collFixtures.UpdateOne(
		context.TODO(),
		bson.M{"_id": fixtureObjID},
		update,
	)
	return err
}

// 2. Count player assists
func CountPlayerStat(playerObjID bson.ObjectID, stat string) (int64, error) {
	collFixtures := client.Database(db).Collection(fixtures)

	pipeline := mongo.Pipeline{
		{{"$project", bson.D{
			{"count", bson.D{
				{"$size", bson.D{
					{"$filter", bson.D{
						{"input", bson.D{{"$ifNull", bson.A{"$" + stat, bson.A{}}}}},
						{"as", "scorer"},
						{"cond", bson.D{{"$eq", bson.A{"$$scorer", playerObjID}}}},
					}},
				}},
			}},
		}}},
		{{"$group", bson.D{
			{"_id", nil},
			{"total", bson.D{{"$sum", "$count"}}},
		}}},
	}

	cursor, err := collFixtures.Aggregate(context.TODO(), pipeline)
	if err != nil {
		return 0, err
	}
	defer cursor.Close(context.TODO())

	var result struct {
		Total int64 `bson:"total"`
	}
	if cursor.Next(context.TODO()) {
		if err := cursor.Decode(&result); err != nil {
			return 0, err
		}
		return result.Total, nil
	}
	return 0, nil
}

// 3. Update player stat field
func UpdatePlayerStatField(playerObjID bson.ObjectID, count int64, stat string) error {
	collPlayers := client.Database(db).Collection(players)
	_, err := collPlayers.UpdateOne(
		context.TODO(),
		bson.M{"_id": playerObjID},
		bson.M{"$set": bson.M{stat: count}},
	)
	return err

}

func AddStatToFixture(fixtureID, playerID, stat string) (Fixture, error) {
	// Add goalscorer to fixture
	err := AddStatToFixtureOnly(fixtureID, playerID, stat)
	if err != nil {
		return Fixture{}, err
	}

	// Convert playerID to ObjectID
	playerObjID, err := bson.ObjectIDFromHex(playerID)
	if err != nil {
		return Fixture{}, err
	}

	// Count stat
	count, err := CountPlayerStat(playerObjID, stat)
	if err != nil {
		return Fixture{}, err
	}

	// Update player stat field
	err = UpdatePlayerStatField(playerObjID, count, stat)
	if err != nil {
		return Fixture{}, err
	}

	// Return the updated fixture (refetch as needed)
	return GetFixtureByID(fixtureID)
}
