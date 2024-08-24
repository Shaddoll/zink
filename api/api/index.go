package handler

import (
    "net/http"
    "os"

    "github.com/gin-gonic/gin"

    "github.com/Shaddoll/zink/api/auth"
    "github.com/Shaddoll/zink/api/config"
    "github.com/Shaddoll/zink/api/handler"
    "github.com/Shaddoll/zink/api/persistence/mongodb"
    "github.com/Shaddoll/zink/api/router"
)

var app *gin.Engine

func init() {
    jwtConfig := &config.JWTConfig{
        Issuer: "Shaddoll",
        Algorithm: "RS512",
        SigningKeyBase64: os.Getenv("SIGNING_KEY"),
        AuthKeyBase64: os.Getenv("AUTH_KEY"),
    }
    tm, err := auth.NewJWTManager(jwtConfig)
    if err != nil {
        panic(err)
    }
    mongoConfig := &config.MongoConfig{
        URI: os.Getenv("MONGO_URI"),
        Database: os.Getenv("MONGO_DATABASE"),
        Username: os.Getenv("MONGO_USER"),
        Password: os.Getenv("MONGO_PASS"),
        RetryWrites: true,
        AppName: "zink-api",
    }
    db, err := mongodb.New(mongoConfig)
    if err != nil {
        panic(err)
    }
    h := handler.New(db, tm)
    app = router.SetupRouter(h, tm)
}

func Handler(w http.ResponseWriter, r *http.Request) {
    app.ServeHTTP(w, r)
}
