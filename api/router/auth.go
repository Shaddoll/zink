package router

import (
    "net/http"
    "strings"

    "github.com/gin-gonic/gin"
    "github.com/Shaddoll/zink/api/auth"
)

func authMiddleware(tm auth.TokenManager) gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is missing"})
            return
        }

        headerParts := strings.Split(authHeader, " ")
        if len(headerParts) != 2 {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is not valid"})
            return
        }

        if headerParts[0] != "Bearer" {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is missing bearer part"})
            return
        }

        username, err := tm.VerifyToken(headerParts[1])
        if err != nil {
            c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
            return
        }

        c.Set("username", username)
        c.Next()
    }
}
