package routes

import (
	"dv4all/goauth2/response"
	"net/http"
)

func demo() http.HandlerFunc {
	return handleDemo
}

func handleDemo(res http.ResponseWriter, req *http.Request) {
	data := response.SetOKResponse("This is demo response")
	data.ReturnResponse(res)
}
