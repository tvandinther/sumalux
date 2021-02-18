package api

import (
	"github.com/gorilla/mux"
	"net/http"
	"path"
)

func Router(apiPrefix string) http.Handler {
	router := mux.NewRouter()

	router.HandleFunc(path.Join(apiPrefix, "light", "scan"), Scan)

	return router
}

func Scan(writer http.ResponseWriter, req *http.Request) {
	writer.Write([]byte(req.URL.Path))
}
