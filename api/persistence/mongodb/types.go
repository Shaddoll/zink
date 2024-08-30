package mongodb

import (
    "time"
)

type (
    Post struct {
        ID string `bson:"id,omitempty"`
        Slug string `bson:"slug,omitempty"`
        Title string `bson:"title,omitempty"`
        Author string `bson:"author,omitempty"`
        Content string `bson:"content,omitempty"`
        Summary string `bson:"summary,omitempty"`
        Tags []string `bson:"tags,omitempty"`
        CreatedAt time.Time `bson:"created_at,omitempty"`
        UpdatedAt time.Time `bson:"updated_at,omitempty"`
    }

    User struct {
        Username string `bson:"username,omitempty"`
        HashedPassword []byte `bson:"hashed_password,omitempty"`
        Salt []byte `json:"salt,omitempty"`
        CreatedAt time.Time `json:"created_at,omitempty"`
        UpdatedAt time.Time `json:"updated_at,omitempty"`
    }

    TagCount struct {
        Tag string `bson:"_id"`
        Count int64 `bson:"count"`
    }
)
