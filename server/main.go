package main

import (
	"calorie-tracker/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"os"
)

func main() {
	port := os.Getenv("PORT")

	if port == "" {
		port = "8000"
	}

	router := gin.New()
	router.Use(gin.Logger())
	router.Use(cors.Default())

	router.GET("/entries", routes.GetAll)
	router.GET("/entries/:id", routes.GetById)
	router.POST("/entries", routes.Create)
	router.PUT("/entries/:id", routes.Update)
	router.DELETE("/entries/:id", routes.Delete)
	router.PUT("/entries/ingredients/:id", routes.UpdateIngredient)
	router.GET("/entries/ingredients/:ingredient", routes.GetByIngredient)

	router.Run(":" + port)
}
