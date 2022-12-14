package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Entry struct {
	Id          primitive.ObjectID `bson:"id"`
	Dish        *string            `json:"dish"`
	Fat         *float64           `json:"fat"`
	Ingredients *string            `json:"ingredients"`
	Calories    *float64           `json:"calories"`
}
