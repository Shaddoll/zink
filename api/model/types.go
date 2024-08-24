package model

import (
    "time"
)

type (
    Post struct {
        ID string `json:"id,omitempty"`
        Title string `json:"title,omitempty"`
        Author string `json:"author,omitempty"`
        Content string `json:"content,omitempty"`
        Summary string `json:"summary,omitempty"`
        Tags []string `json:"tags,omitempty"`
        CreatedAt time.Time `json:"created_at,omitempty"`
        UpdatedAt time.Time `json:"updated_at,omitempty"`
    }

    User struct {
        Username string `json:"username,omitempty"`
        HashedPassword []byte `json:"hashed_password,omitempty"`
        Salt []byte `json:"salt,omitempty"`
        CreatedAt time.Time `json:"created_at,omitempty"`
        UpdatedAt time.Time `json:"updated_at,omitempty"`
    }
)
