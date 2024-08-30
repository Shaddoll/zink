package handler

import (
    "context"

    "github.com/Shaddoll/zink/api/model"
)

type (
    ListPostsRequest struct {}

    ListPostsResponse struct {
        Posts []*model.Post
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

    GetPostRequest struct {
        PostID string
    }

    GetPostResponse struct {
        Post *model.Post
    }

    GetPostBySlugRequest struct {
        Slug string
    }

    GetPostBySlugResponse struct {
        Post *model.Post
    }

    CreatePostRequest struct {
        Post *model.Post
    }

    CreatePostResponse struct {
        PostID string
        Slug string
    }

    UpdatePostRequest struct {
        OriginalSlug string
        Post *model.Post
    }

    UpdatePostResponse struct {}

    CreateUserRequest struct {
        Username string
        Password string
    }

    CreateUserResponse struct {}

    AuthenticateUserRequest struct {
        Username string
        Password string
    }

    AuthenticateUserResponse struct {
        Token string
    }

    Handler interface {
        ListPosts(context.Context, *ListPostsRequest) (*ListPostsResponse, error)
        GetPostsByTag(context.Context, *GetPostsByTagRequest) (*GetPostsByTagResponse, error)
        GetPost(context.Context, *GetPostRequest) (*GetPostResponse, error)
        GetPostBySlug(context.Context, *GetPostBySlugRequest) (*GetPostBySlugResponse, error)
        GetTagCounts(context.Context, *GetTagCountsRequest) (*GetTagCountsResponse, error)
        CreatePost(context.Context, *CreatePostRequest) (*CreatePostResponse, error)
        UpdatePost(context.Context, *UpdatePostRequest) (*UpdatePostResponse, error)

        CreateUser(context.Context, *CreateUserRequest) (*CreateUserResponse, error)
        AuthenticateUser(context.Context, *AuthenticateUserRequest) (*AuthenticateUserResponse, error)
    }
)
