package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/crusty0530/stattable/internal/db"
)

type SearchResponse struct {
	ID       string `json:"id"`
	Username string `json:"username"`
}

func SearchUsers(w http.ResponseWriter, r *http.Request) {

	username := r.URL.Query().Get("username")
	var users []SearchResponse

	rows, err := db.DB.Query("SELECT id, username FROM users WHERE username ILIKE $1", "%"+username+"%")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var user SearchResponse

		err := rows.Scan(&user.ID, &user.Username)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		users = append(users, user)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}
