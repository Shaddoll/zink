package handler

import (
    "context"
    "crypto/rand"
    "fmt"
    "strconv"
    "time"

    "github.com/gosimple/slug"
    "github.com/Shaddoll/zink/api/auth"
    "github.com/Shaddoll/zink/api/model"
    "github.com/Shaddoll/zink/api/persistence"
    "golang.org/x/crypto/bcrypt"
)

type (
    handlerImpl struct {
        db persistence.DB
        tm auth.TokenManager
    }
)

func New(db persistence.DB, tm auth.TokenManager) Handler {
    return &handlerImpl{
        tm: tm,
        db: db,
    }
}

func (h *handlerImpl) ListPosts(ctx context.Context, req *ListPostsRequest) (*ListPostsResponse, error) {
    resp, err := h.db.ListPosts(ctx, &persistence.ListPostsRequest{})
    if err != nil {
        return nil, err
    }
    return &ListPostsResponse{
        Posts: resp.Posts,
    }, nil
}

func (h *handlerImpl) GetPostsByTag(ctx context.Context, req *GetPostsByTagRequest) (*GetPostsByTagResponse, error) {
    resp, err := h.db.GetPostsByTag(ctx, &persistence.GetPostsByTagRequest{Tag: req.Tag})
    if err != nil {
        return nil, err
    }
    return &GetPostsByTagResponse{
        Posts: resp.Posts,
    }, nil
}

func (h *handlerImpl) GetPost(ctx context.Context, req *GetPostRequest) (*GetPostResponse, error) {
    resp, err := h.db.GetPostByID(ctx, &persistence.GetPostByIDRequest{
        PostID: req.PostID,
    })
    if err != nil {
        return nil, err
    }
    return &GetPostResponse{
        Post: resp.Post,
    }, nil
}

func (h *handlerImpl) GetPostBySlug(ctx context.Context, req *GetPostBySlugRequest) (*GetPostBySlugResponse, error) {
    resp, err := h.db.GetPostBySlug(ctx, &persistence.GetPostBySlugRequest{
        Slug: req.Slug,
    })
    if err != nil {
        return nil, err
    }
    return &GetPostBySlugResponse{
        Post: resp.Post,
    }, nil
}

func (h *handlerImpl) GetTagCounts(ctx context.Context, req *GetTagCountsRequest) (*GetTagCountsResponse, error) {
    resp, err := h.db.GetTagCounts(ctx, &persistence.GetTagCountsRequest{})
    if err != nil {
        return nil, err
    }
    return &GetTagCountsResponse{
        TagCounts: resp.TagCounts,
    }, nil
}

func (h *handlerImpl) generateSlug(ctx context.Context, baseSlug string, slugs map[string]struct{}) (string, error) {
    slug := baseSlug
    if len(slugs) > 0 {
        i := 1
        for {
            if _, ok := slugs[slug]; !ok {
                break
            }
            slug = fmt.Sprintf("%s-%v", baseSlug, i)
            i++
        }
    }
    return slug, nil
}

func (h *handlerImpl) CreatePost(ctx context.Context, req *CreatePostRequest) (*CreatePostResponse, error) {
    cResp, err := h.db.CountPosts(ctx, &persistence.CountPostsRequest{})
    if err != nil {
        return nil, err
    }
    id := strconv.FormatInt(cResp.Count + 1, 10)
    req.Post.ID = id

    baseSlug := slug.Make(req.Post.Title)
    sResp, err := h.db.GetSimilarSlugs(ctx, &persistence.GetSimilarSlugsRequest{BaseSlug: baseSlug})
    if err != nil {
        return nil, err
    }
    slug, err := h.generateSlug(ctx, baseSlug, sResp.Slugs)
    if err != nil {
        return nil, err
    }
    req.Post.Slug = slug

    now := time.Now()
    req.Post.CreatedAt = now
    req.Post.UpdatedAt = now
    _, err = h.db.CreatePost(ctx, &persistence.CreatePostRequest{
        req.Post,
    })
    if err != nil {
        return nil, err
    }
    return &CreatePostResponse{
        PostID: id,
        Slug: slug,
    }, nil
}

func (h *handlerImpl) UpdatePost(ctx context.Context, req *UpdatePostRequest) (*UpdatePostResponse, error) {
    resp, err := h.db.GetPostBySlug(ctx, &persistence.GetPostBySlugRequest{
        Slug: req.OriginalSlug,
    })
    if err != nil {
        return nil, err
    }
    if req.Post.Title != resp.Post.Title {
        baseSlug := slug.Make(req.Post.Title)
        sResp, err := h.db.GetSimilarSlugs(ctx, &persistence.GetSimilarSlugsRequest{BaseSlug: baseSlug})
        if err != nil {
            return nil, err
        }
        delete(sResp.Slugs, req.OriginalSlug)
        slug, err := h.generateSlug(ctx, baseSlug, sResp.Slugs)
        if err != nil {
            return nil, err
        }
        req.Post.Slug = slug
    }
    req.Post.ID = resp.Post.ID
    now := time.Now()
    req.Post.UpdatedAt = now
    _, err = h.db.UpdatePost(ctx, &persistence.UpdatePostRequest{
        req.Post,
    })
    if err != nil {
        return nil, err
    }
    return &UpdatePostResponse{
    }, nil
}


func (h *handlerImpl) CreateUser(ctx context.Context, req *CreateUserRequest) (*CreateUserResponse, error) {
    salt, err := generateSalt()
    if err != nil {
        return nil, err
    }
    toHash := append([]byte(req.Password), salt...)
    now := time.Now()
    hashedPassword, err := bcrypt.GenerateFromPassword(toHash, bcrypt.DefaultCost)
    if err != nil {
        return nil, err
    }
    user := &model.User{
        Username: req.Username,
        HashedPassword: hashedPassword,
        Salt: salt,
        CreatedAt: now,
        UpdatedAt: now,
    }
    _, err = h.db.CreateUser(ctx, &persistence.CreateUserRequest{
        User: user,
    })
    if err != nil {
        return nil, err
    }
    return &CreateUserResponse{}, nil
}

func generateSalt() ([]byte, error) {
    salt := make([]byte, 16)
    if _, err := rand.Read(salt); err != nil {
        return nil, err
    }
    return salt, nil
}

func (h *handlerImpl) AuthenticateUser(ctx context.Context, req *AuthenticateUserRequest) (*AuthenticateUserResponse, error) {
    resp, err := h.db.GetUser(ctx, &persistence.GetUserRequest{
        Username: req.Username,
    })
    if err != nil {
        return nil, err
    }
    salted := append([]byte(req.Password), resp.User.Salt...)
    err = bcrypt.CompareHashAndPassword(resp.User.HashedPassword, salted)
    if err != nil {
        return nil, err
    }
    token, err := h.tm.GenerateToken(req.Username)
    if err != nil {
        return nil, err
    }
    return &AuthenticateUserResponse{Token: token}, nil
}
