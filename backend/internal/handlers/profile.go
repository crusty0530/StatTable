package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/crusty0530/stattable/internal/db"
	"github.com/go-chi/chi/v5"
)

type ProfileResponse struct {
	ID             string  `json:"id"`
	Email          string  `json:"email"`
	Username       string  `json:"username"`
	Avatar         *string `json:"avatar"`
	FavoriteDeckID *string `json:"favorite_deck_id"`
}

func Profile(w http.ResponseWriter, r *http.Request) {

	id := chi.URLParam(r, "id")

	var p ProfileResponse
	err := db.DB.QueryRow("SELECT id, email, username, avatar, favorite_deck_id FROM users WHERE id = $1", id).Scan(&p.ID, &p.Email, &p.Username, &p.Avatar, &p.FavoriteDeckID)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}
