package routes

import (
	"calorie-tracker/models"
	"context"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"net/http"
	"time"
)

var entryCollection = OpenCollection(Client, "calories")
var validate = validator.New()

func GetAll(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

	defer cancel()

	var entries []bson.M
	cursor, err := entryCollection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	if err = cursor.All(ctx, &entries); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	fmt.Println(entries)

	c.JSON(http.StatusOK, entries)
}

func GetById(c *gin.Context) {
	id := c.Param("id")
	docId, _ := primitive.ObjectIDFromHex(id)

	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	var entry bson.M

	defer cancel()

	if err := entryCollection.FindOne(ctx, bson.M{"_id": docId}).Decode(&entry); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	fmt.Println(entry)

	c.JSON(http.StatusOK, entry)
}

func GetByIngredient(c *gin.Context) {
	ingredients := c.Param("id")
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	var entries []bson.M

	defer cancel()

	cursor, err := entryCollection.Find(ctx, bson.M{"ingredients": ingredients})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	if err = cursor.All(ctx, entries); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	fmt.Println(entries)

	c.JSON(http.StatusOK, entries)
}

func Create(c *gin.Context) {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	var entry models.Entry

	defer cancel()

	if err := c.BindJSON(&entry); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	if validationErr := validate.Struct(entry); validationErr != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": validationErr.Error()})
		fmt.Println(validationErr)
		return
	}

	entry.Id = primitive.NewObjectID()

	res, insertErr := entryCollection.InsertOne(ctx, entry)
	if insertErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Order item was not created.")})
		fmt.Println(insertErr)
		return
	}

	c.JSON(http.StatusOK, res)
}

func Update(c *gin.Context) {
	docId, _ := primitive.ObjectIDFromHex(c.Param("id"))

	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

	defer cancel()

	var entry models.Entry

	if err := c.BindJSON(&entry); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	if validationErr := validate.Struct(entry); validationErr != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{"error": validationErr.Error()})
		fmt.Println(validationErr)
		return
	}

	res, err := entryCollection.ReplaceOne(
		ctx,
		bson.M{"_id": docId},
		bson.M{"dish": entry.Dish, "fat": entry.Fat, "ingredients": entry.Ingredients, "calories": entry.Calories},
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusOK, res.ModifiedCount)
}

func UpdateIngredient(c *gin.Context) {
	docId, _ := primitive.ObjectIDFromHex(c.Param("id"))
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

	defer cancel()

	type Ingredient struct {
		Ingredients *string `json:"ingredients"`
	}

	var ingredients Ingredient

	if err := c.BindJSON(ingredients); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	res, err := entryCollection.UpdateOne(ctx, bson.M{"_id": docId}, bson.D{{"$set", bson.D{{"ingredients", ingredients}}}})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusOK, res.ModifiedCount)
}

func Delete(c *gin.Context) {
	entryId := c.Param("id")
	docId, _ := primitive.ObjectIDFromHex(entryId)

	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)

	defer cancel()

	res, err := entryCollection.DeleteOne(ctx, bson.M{"_id": docId})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		fmt.Println(err)
		return
	}

	c.JSON(http.StatusOK, res.DeletedCount)
}
