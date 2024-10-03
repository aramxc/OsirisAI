package main

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

var phrases = []string{
	"Hello there!",
	"How can I assist you?",
	"That's an interesting question.",
	"I'm processing your request.",
	"Let me think about that.",
}

const tickerInterval = 3 * time.Second

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Error upgrading to WebSocket: %v", err)
		return
	}
	defer conn.Close()

	log.Printf("New WebSocket connection from %s", conn.RemoteAddr())

	ticker := time.NewTicker(tickerInterval)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			if err := conn.WriteJSON(generateResponse()); err != nil {
				log.Printf("Error writing to WebSocket: %v", err)
				return
			}
		default:
			_, _, err := conn.ReadMessage()
			if err != nil {
				log.Printf("Error reading message: %v", err)
				return
			}
		}
	}
}

func generateResponse() map[string]string {
	return map[string]string{"message": phrases[rand.Intn(len(phrases))]}
}

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello, World!")
	})

	http.HandleFunc("/ws", handleWebSocket)

	server := &http.Server{Addr: ":8080"}

	go func() {
		log.Println("Server starting on http://localhost:8080")
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	}()

	// Graceful shutdown
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)
	<-stop

	log.Println("Shutting down server...")
	if err := server.Close(); err != nil {
		log.Printf("Error during server shutdown: %v", err)
	}
	log.Println("Server stopped")
}
