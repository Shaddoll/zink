package router

import (
    "net/http"
    "sync"

    "github.com/gin-gonic/gin"
    "github.com/gorilla/websocket"
)

var allowedOrigins = map[string]bool{
    "https://zink.top": true,
    "http://localhost:3000": true,
}

var upgrader = websocket.Upgrader{
    CheckOrigin: func(r *http.Request) bool {
        origin := r.Header.Get("Origin")
        return allowedOrigins[origin]
    },
}

var onlineUsers int
var mu sync.Mutex
var clients = make(map[*websocket.Conn]bool) // Keeps track of connected clients

func broadcastOnlineUsers() {
    mu.Lock()
    defer mu.Unlock()

    for client := range clients {
        err := client.WriteJSON(map[string]int{"online_users": onlineUsers})
        if err != nil {
            client.Close()
            delete(clients, client)
        }
    }
}

func wsHandler(c *gin.Context) {
    conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upgrade connection"})
        return
    }
    defer conn.Close()

    mu.Lock()
    onlineUsers++
    clients[conn] = true
    mu.Unlock()

    // Broadcast the new count of online users
    broadcastOnlineUsers()

    // Handle messages from the client
    for {
        _, _, err := conn.ReadMessage()
        if err != nil {
            break
        }
    }

    mu.Lock()
    onlineUsers--
    delete(clients, conn)
    mu.Unlock()

    // Broadcast the new count of online users after a client disconnects
    broadcastOnlineUsers()
}
