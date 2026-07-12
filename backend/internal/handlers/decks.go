package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/crusty0530/stattable/internal/db"
	"github.com/go-chi/chi/v5"
	"github.com/lib/pq"
)

type DeckResponse struct {
	ID                string   `json:"id"`
	DeckName          string   `json:"deck_name"`
	CommanderName     string   `json:"commander_name"`
	CommanderImageUri string   `json:"commander_image_uri"`
	ColorIdentity     []string `json:"color_identity"`
	ScryfallId        string   `json:"scryfall_id"`
	Playstyle         string   `json:"playstyle"`
}

type CreateDeckRequest struct {
	DeckName          string   `json:"deck_name"`
	CommanderName     string   `json:"commander_name"`
	CommanderImageUri string   `json:"commander_image_uri"`
	ColorIdentity     []string `json:"color_identity"`
	ScryfallID        string   `json:"scryfall_id"`
	Playstyle         string   `json:"playstyle"`
}

func GetDecks(w http.ResponseWriter, r *http.Request) {

	id := chi.URLParam(r, "id")

	var decks []DeckResponse
	rows, err := db.DB.Query("SELECT id, deck_name, commander_name, commander_image_uri, color_identity, scryfall_id, playstyle FROM decks WHERE user_id = $1", id)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	defer rows.Close()

	for rows.Next() {
		var deck DeckResponse

		err := rows.Scan(&deck.ID, &deck.DeckName, &deck.CommanderName, &deck.CommanderImageUri, pq.Array(&deck.ColorIdentity), &deck.ScryfallId, &deck.Playstyle)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		decks = append(decks, deck)

	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(decks)
}

func CreateDeck(w http.ResponseWriter, r *http.Request) {

	var request CreateDeckRequest

	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	userID := r.Context().Value("userID").(string)

	var id string

	err = db.DB.QueryRow(`INSERT INTO decks (user_id, deck_name, commander_name, commander_image_uri, color_identity, scryfall_id, playstyle) 
						VALUES ($1, $2, $3, $4, $5, $6, $7)
						RETURNING id`, userID, request.DeckName, request.CommanderName, request.CommanderImageUri, pq.Array(request.ColorIdentity), request.ScryfallID, request.Playstyle).Scan(&id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"id": id})
}
