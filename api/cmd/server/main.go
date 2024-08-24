package main

import (
    "os"

    "github.com/joho/godotenv"

    "github.com/Shaddoll/zink/api/auth"
    "github.com/Shaddoll/zink/api/config"
    "github.com/Shaddoll/zink/api/handler"
    "github.com/Shaddoll/zink/api/persistence/mongodb"
    "github.com/Shaddoll/zink/api/router"
)

func main() {
    if os.Getenv("environment") == "" {
        err := godotenv.Load()
        if err != nil {
            panic(err)
        }
    }
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
    r := router.SetupRouter(h, tm)
    r.Run(":8000")
}
