package errors

import (
    "fmt"
)

type (
    PostNotFoundError struct {
        PostID string
        Slug string
    }

    PostAlreadyExistsError struct {
        PostID string
        Slug string
    }

    UserAlreadyExistsError struct {
        Username string
    }

    UserNotExistsError struct {
        Username string
    }
)

func (e *PostNotFoundError) Error() string {
    if e.PostID != "" {
        return fmt.Sprintf("PostID: %v not found", e.PostID)
    }
    return fmt.Sprintf("Post: %v not found", e.Slug)
}

func (e *PostAlreadyExistsError) Error() string {
    return fmt.Sprintf("Post ID: %v, Slug: %v already exists", e.PostID, e.Slug)
}

func (e *UserAlreadyExistsError) Error() string {
    return fmt.Sprintf("User: %v already exists", e.Username)
}

func (e *UserNotExistsError) Error() string {
    return fmt.Sprintf("User: %v not exists", e.Username)
}
