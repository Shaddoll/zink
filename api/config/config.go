package config

type (
    JWTConfig struct {
        Issuer string `yaml:"issuer"`
        Algorithm string `yaml:"algorithm"`
        SigningKeyBase64 string `yaml:"signingKeyBase64"`
        AuthKeyBase64 string `yaml:"authKeyBase64"`
    }

    MongoConfig struct {
        URI string `yaml:"uri"`
        Database string `yaml:"database"`
        AppName string `yaml:"appName"`
        Username string `yaml:"username"`
        Password string `yaml:"password"`
        RetryWrites bool `yaml:"retryWrites"`
    }
)
