package main

import (
	"log"
	"net/http"

	"github.com/crusty0530/stattable/internal/db"
	"github.com/crusty0530/stattable/internal/handlers"
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
	r.Get("/profile/{id}", handlers.Profile)

	http.ListenAndServe(":8080", r)
}
