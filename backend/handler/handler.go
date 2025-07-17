package handler

import (
	"encoding/json"
	"log"
	"net/http"
)

func Home(w http.ResponseWriter, r *http.Request) {
	log.Printf("%s request received to %s", r.Method, r.URL.Path)
	json.NewEncoder(w).Encode("Hello World")
}
