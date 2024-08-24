package errors

import (
    "fmt"
)

type (
    PostNotFoundError struct {
        PostID string
    }

    PostAlreadyExistsError struct {
        PostID string
    }

    UserAlreadyExistsError struct {
        Username string
    }

    UserNotExistsError struct {
        Username string
    }
)

func (e *PostNotFoundError) Error() string {
    return fmt.Sprintf("Post: %v not found", e.PostID)
}

func (e *PostAlreadyExistsError) Error() string {
    return fmt.Sprintf("Post: %v already exists", e.PostID)
}

func (e *UserAlreadyExistsError) Error() string {
    return fmt.Sprintf("User: %v already exists", e.Username)
}

func (e *UserNotExistsError) Error() string {
    return fmt.Sprintf("User: %v not exists", e.Username)
}
