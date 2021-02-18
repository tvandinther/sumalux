package server

import (
	"fmt"
	"github.com/gorilla/mux"
	"github.com/tvandinther/simulux/server/api"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

const port = 8081
const apiPrefix = "/api"

type spaHandler struct {
	staticPath string
	indexPath string
}

func (handler spaHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	path, err := filepath.Abs(req.URL.Path)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	path = filepath.Join(handler.staticPath, path)

	_, err = os.Stat(path)
	if os.IsNotExist(err) {
		http.ServeFile(w, req, filepath.Join(handler.staticPath, handler.indexPath))
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	http.FileServer(http.Dir(handler.staticPath)).ServeHTTP(w, req)
}

func Start() {
	fmt.Println("Starting server...")

	router := mux.NewRouter().StrictSlash(true)

	router.PathPrefix(apiPrefix).Handler(api.Router(apiPrefix))

	router.PathPrefix("/").Handler(spaHandler{
		staticPath: "./client/dist/simulux",
		indexPath: "index.html",
	})

	addr := fmt.Sprintf(":%d", port)

	fmt.Printf("Server listening on %s...\n", addr)
	server := &http.Server{
		Handler: router,
		Addr: addr,
		WriteTimeout: 15 * time.Second,
		ReadTimeout: 15 * time.Second,
	}

	log.Fatal(server.ListenAndServe())
}