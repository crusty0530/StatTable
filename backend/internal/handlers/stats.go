package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/crusty0530/stattable/internal/db"
	"github.com/go-chi/chi/v5"
)

// Player Stats Response Struct
type PlayerStatsResponse struct {
	TotalGamesPlayed int     `json:"total_games_played"`
	TotalWins        int     `json:"total_wins"`
	WinRate          float64 `json:"win_rate"`
	AveragePlacement float64 `json:"average_placement"`
	MostPlayedDeck   string  `json:"most_played_deck"`
}

// Handler Function
func Stats(w http.ResponseWriter, r *http.Request) {

	id := chi.URLParam(r, "id")
	var p PlayerStatsResponse

	//Total Games Player Query
	err := db.DB.QueryRow("SELECT COUNT(*) FROM game_participants WHERE user_id = $1", id).Scan(&p.TotalGamesPlayed)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Total Wins Query
	err = db.DB.QueryRow("SELECT COUNT(*) FROM game_participants WHERE user_id = $1 AND placement = 1", id).Scan(&p.TotalWins)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Average Placement Query
	err = db.DB.QueryRow("SELECT COALESCE(AVG(placement), 0) FROM game_participants WHERE user_id = $1", id).Scan(&p.AveragePlacement)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Win Rate Calculation
	if p.TotalGamesPlayed > 0 {
		p.WinRate = float64(p.TotalWins) / float64(p.TotalGamesPlayed) * 100
	}

	// Most Played Deck Query
	err = db.DB.QueryRow(`SELECT d.deck_name FROM game_participants gp
							JOIN decks d ON gp.deck_id = d.id
							WHERE gp.user_id = $1
							GROUP BY d.deck_name
							ORDER BY COUNT(*) DESC
							LIMIT 1`, id).Scan(&p.MostPlayedDeck)

	if err == sql.ErrNoRows {
		p.MostPlayedDeck = ""
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}
