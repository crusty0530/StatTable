package db

import (
	"database/sql"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func Init() error {

	url := os.Getenv("DATABASE_URL")
	db, err := sql.Open("postgres", url)

	if err != nil {
		return err
	}

	err = db.Ping()
	if err != nil {
		return err
	}

	DB = db
	return nil
}
