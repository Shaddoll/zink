package auth

import (
    "encoding/base64"
    "fmt"
    "reflect"
    "time"

    "github.com/golang-jwt/jwt/v5"
    "github.com/google/uuid"
    "github.com/Shaddoll/zink/api/config"
)

type (
    TokenManager interface {
        GenerateToken(string) (string, error)
        VerifyToken(string) (string, error)
    }

    jwtManager struct {
        issuer string
        //audience jwt.ClaimStrings

        signingMethod jwt.SigningMethod
        signingKey interface{}
        authKey interface{}
    }
)

func NewJWTManager(c *config.JWTConfig) (TokenManager, error) {
    signingMethod := jwt.GetSigningMethod(c.Algorithm)
    if signingMethod == nil {
        return nil, fmt.Errorf("signing method not supported: %v", c.Algorithm)
    }
    sk, err := base64.StdEncoding.DecodeString(c.SigningKeyBase64)
    if err != nil {
        return nil, fmt.Errorf("failed to decode signing key: %w", err)
    }
    ak, err := base64.StdEncoding.DecodeString(c.AuthKeyBase64)
    if err != nil {
        return nil, fmt.Errorf("failed to decode auth key: %w", err)
    }
    signingKey, authKey, err := parseKeys(c.Algorithm, sk, ak)
    if err != nil {
        return nil, err
    }
    return &jwtManager{
        issuer: c.Issuer,
        signingMethod: signingMethod,
        signingKey: signingKey,
        authKey: authKey,
    }, nil
}

func parseKeys(algorithm string, signingKey, authKey []byte) (interface{}, interface{}, error) {
    switch algorithm {
    case "ES256", "ES384", "ES512":
        sk, err := jwt.ParseECPrivateKeyFromPEM(signingKey)
        if err != nil {
            return nil, nil, err
        }
        ak, err := jwt.ParseECPublicKeyFromPEM(authKey)
        if err != nil {
            return nil, nil, err
        }
        return sk, ak, nil
    case "EdDSA":
        sk, err := jwt.ParseEdPrivateKeyFromPEM(signingKey)
        if err != nil {
            return nil, nil, err
        }
        ak, err := jwt.ParseEdPublicKeyFromPEM(authKey)
        if err != nil {
            return nil, nil, err
        }
        return sk, ak, nil
    case "RS256", "RS384", "RS512":
        sk, err := jwt.ParseRSAPrivateKeyFromPEM(signingKey)
        if err != nil {
            return nil, nil, err
        }
        ak, err := jwt.ParseRSAPublicKeyFromPEM(authKey)
        if err != nil {
            return nil, nil, err
        }
        return sk, ak, nil
    case "HS256", "HS384", "HS512":
        return signingKey, authKey, nil
    default:
        return nil, nil, fmt.Errorf("signing method not supported: %v", algorithm)
    }
}

func (m *jwtManager) GenerateToken(username string) (string, error) {
    now := time.Now()
    token := jwt.NewWithClaims(m.signingMethod, jwt.RegisteredClaims{
        Issuer: m.issuer,
        Subject: username,
        //Audience: m.audience,
        ExpiresAt: jwt.NewNumericDate(now.Add(time.Hour * 24 * 7)),
        NotBefore: jwt.NewNumericDate(now),
        IssuedAt: jwt.NewNumericDate(now),
        ID: uuid.NewString(),
    })

    return token.SignedString(m.signingKey)
}

func (m *jwtManager) VerifyToken(tokenStr string) (string, error) {
    token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
        // check signing method first, then return the verify key
        if reflect.TypeOf(token.Method) != reflect.TypeOf(m.signingMethod) {
            return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
        }
        return m.authKey, nil
    })
    if err != nil {
        return "", err
    }
    if !token.Valid {
        return "", fmt.Errorf("token is not valid")
    }
    username, err := token.Claims.GetSubject()
    if err != nil {
        return "", err
    }
    return username, nil
}
