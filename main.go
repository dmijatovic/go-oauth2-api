package main

import (
	"log"
	"net/http"

	"dv4all/goauth2/pgdb"
	"dv4all/goauth2/routes"
)

// ENV VARIABLES
var apiHost string = "0.0.0.0:8080"
var pgHost string = "pgdb"
var pgPort int = 5432
var pgUser string = "postgres"
var pgPass string = "changeme"
var pgDb string = "auth_db"

func main() {
	log.Println("Starting...", apiHost)
	// create new router
	mux := routes.Register()

	// connect to postgres database
	cnnStr := pgdb.ConnectionStr(pgdb.Settings{
		Host:     pgHost,
		Port:     pgPort,
		User:     pgUser,
		Password: pgPass,
		Dbname:   pgDb,
	})
	// println(cnnStr)
	db := pgdb.Connect(cnnStr)
	//close connection at the end
	defer db.Close()

	//start server and register router
	log.Fatal(http.ListenAndServe(apiHost, mux))
}
