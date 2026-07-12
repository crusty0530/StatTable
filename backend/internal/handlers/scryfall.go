package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
)

type ScryfallCard struct {
	ID            string            `json:"id"`
	Name          string            `json:"name"`
	ImageUris     map[string]string `json:"image_uris"`
	ColorIdentity []string          `json:"color_identity"`
}

type ScryfallResponse struct {
	Data []ScryfallCard `json:"data"`
}

func SearchCommanders(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	if query == "" {
		http.Error(w, "query parameter required", http.StatusBadRequest)
		return
	}

	searchURL := fmt.Sprintf("https://api.scryfall.com/cards/search?q=%s+t%%3Alegendary+t%%3Acreature+legal%%3Acommander", url.QueryEscape(query))

	client := &http.Client{}
	req, err := http.NewRequest("GET", searchURL, nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	req.Header.Set("User-Agent", "StatTable/1.0")
	req.Header.Set("Accept", "application/json")

	response, err := client.Do(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer response.Body.Close()

	var scryfallResponse ScryfallResponse
	err = json.NewDecoder(response.Body).Decode(&scryfallResponse)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(scryfallResponse.Data)
}
