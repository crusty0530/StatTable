package main

import (
	"log"
	"net/http"

	"github.com/crusty0530/stattable/internal/db"
	"github.com/crusty0530/stattable/internal/handlers"
	appMiddleware "github.com/crusty0530/stattable/internal/middleware"
	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	err := db.Init()

	if err != nil {
		log.Fatal(err)
	}

	r := chi.NewRouter()

	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("ok"))
	})
	r.Get("/search/commanders", handlers.SearchCommanders)

	r.Group(func(r chi.Router) {
		r.Use(appMiddleware.AuthMiddleware)
		r.Get("/profile/{id}", handlers.Profile)
		r.Get("/stats/{id}", handlers.Stats)
		r.Get("/decks/{id}", handlers.GetDecks)
		r.Post("/decks", handlers.CreateDeck)
		r.Delete("/decks/{id}", handlers.DeleteDeck)
		r.Get("/users/search", handlers.SearchUsers)
	})

	http.ListenAndServe(":8080", r)
}
