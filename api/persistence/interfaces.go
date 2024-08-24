package persistence

import (
    "context"

    "github.com/Shaddoll/zink/api/model"
)

type (
    ListPostsRequest struct {}

    ListPostsResponse struct {
        Posts []*model.Post
    }

    GetPostByIDRequest struct {
        PostID string
    }

    GetPostByIDResponse struct {
        Post *model.Post
    }

    GetPostsByTagRequest struct {
        Tag string
    }

    GetPostsByTagResponse struct {
        Posts []*model.Post
    }

    GetTagCountsRequest struct {}

    GetTagCountsResponse struct {
        TagCounts map[string]int64
    }

    CreatePostRequest struct {
        Post *model.Post
    }

    CreatePostResponse struct {
        PostID string
    }

    UpdatePostRequest struct {
        Post *model.Post
    }

    UpdatePostResponse struct {}

    CountPostsRequest struct {}

    CountPostsResponse struct {
        Count int64
    }

    CreateUserRequest struct {
        User *model.User
    }

    CreateUserResponse struct {}

    GetUserRequest struct {
        Username string
    }

    GetUserResponse struct {
        User *model.User
    }

    DB interface {
        ListPosts(context.Context, *ListPostsRequest) (*ListPostsResponse, error)
        GetPostByID(context.Context, *GetPostByIDRequest) (*GetPostByIDResponse, error)
        GetPostsByTag(context.Context, *GetPostsByTagRequest) (*GetPostsByTagResponse, error)
        GetTagCounts(context.Context, *GetTagCountsRequest) (*GetTagCountsResponse, error)
        CreatePost(context.Context, *CreatePostRequest) (*CreatePostResponse, error)
        UpdatePost(context.Context, *UpdatePostRequest) (*UpdatePostResponse, error)
        CountPosts(context.Context, *CountPostsRequest) (*CountPostsResponse, error)

        CreateUser(context.Context, *CreateUserRequest) (*CreateUserResponse, error)
        GetUser(context.Context, *GetUserRequest) (*GetUserResponse, error)
    }
)
