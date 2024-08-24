package router

import (
    "context"
    "errors"
    "net/http"
    "time"

    "github.com/gin-gonic/gin"

    "github.com/Shaddoll/zink/api/auth"
    errs "github.com/Shaddoll/zink/api/errors"
    "github.com/Shaddoll/zink/api/handler"
    "github.com/Shaddoll/zink/api/model"
)

func SetupRouter(h handler.Handler, tm auth.TokenManager) *gin.Engine {
    r := gin.Default()

    auth := r.Group("/")
    auth.Use(authMiddleware(tm))

    r.GET("/posts", func (c *gin.Context) {
        ctx, cancel := context.WithTimeout(context.Background(), time.Second)
        defer cancel()

        resp, err := h.ListPosts(ctx, &handler.ListPostsRequest{})
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        c.JSON(http.StatusOK, resp.Posts)
    })

    r.GET("/tags", func(c *gin.Context) {
        ctx, cancel := context.WithTimeout(context.Background(), time.Second)
        defer cancel()
        resp, err := h.GetTagCounts(ctx, &handler.GetTagCountsRequest{})
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        c.JSON(http.StatusOK, resp.TagCounts)
    })

    r.GET("/tags/:tag", func(c *gin.Context) {
        tag := c.Param("tag")
        ctx, cancel := context.WithTimeout(context.Background(), time.Second)
        defer cancel()
        resp, err := h.GetPostsByTag(ctx, &handler.GetPostsByTagRequest{
            Tag: tag,
        })
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        c.JSON(http.StatusOK, resp.Posts)
    })

    r.GET("/post/:id", func(c *gin.Context) {
        postID := c.Param("id")
        ctx, cancel := context.WithTimeout(context.Background(), time.Second)
        defer cancel()
        resp, err := h.GetPost(ctx, &handler.GetPostRequest{
            PostID: postID,
        })
        if err != nil {
            var e *errs.PostNotFoundError
            if errors.As(err, &e) {
                c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
                return
            }
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        c.JSON(http.StatusOK, resp.Post)
    })

    auth.POST("/post/update/:id", func(c *gin.Context) {
        postID := c.Param("id")
        var post *model.Post
        if err := c.BindJSON(&post); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }
        post.ID = postID
        ctx, cancel := context.WithTimeout(context.Background(), time.Second)
        defer cancel()
        _, err := h.UpdatePost(ctx, &handler.UpdatePostRequest{
            Post: post,
        })
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        c.JSON(http.StatusOK, gin.H{"success": true})
    })

    auth.POST("/post/create", func(c *gin.Context) {
        var post *model.Post
        if err := c.BindJSON(&post); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }
        ctx, cancel := context.WithTimeout(context.Background(), time.Second)
        defer cancel()
        resp, err := h.CreatePost(ctx, &handler.CreatePostRequest{
            Post: post,
        })
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        c.JSON(http.StatusOK, gin.H{"postID": resp.PostID})
    })

    r.POST("/signup", func(c *gin.Context) {
        var req *handler.CreateUserRequest
        if err := c.BindJSON(&req); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }
        ctx, cancel := context.WithTimeout(context.Background(), time.Second)
        defer cancel()
        _, err := h.CreateUser(ctx, req)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        c.JSON(http.StatusOK, gin.H{"username": req.Username})
    })

    r.POST("/login", func(c *gin.Context) {
        var req *handler.AuthenticateUserRequest
        if err := c.BindJSON(&req); err != nil {
            c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            return
        }
        ctx, cancel := context.WithTimeout(context.Background(), time.Second)
        defer cancel()
        resp, err := h.AuthenticateUser(ctx, req)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        c.JSON(http.StatusOK, gin.H{"username": req.Username, "token": resp.Token})
    })
    return r
}
