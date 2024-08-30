package mongodb

import (
    "context"
    "fmt"
    "regexp"

    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo/options"
    "go.mongodb.org/mongo-driver/mongo/writeconcern"

    "github.com/Shaddoll/zink/api/config"
    "github.com/Shaddoll/zink/api/errors"
    "github.com/Shaddoll/zink/api/model"
    "github.com/Shaddoll/zink/api/persistence"
)

type (
    mdb struct {
        client *mongo.Client
        dbConn *mongo.Database
    }
)

func New(cfg *config.MongoConfig) (persistence.DB, error) {
    connectOptions := options.Client().
        ApplyURI(cfg.URI).
        SetAppName(cfg.AppName).
        SetAuth(options.Credential{
            Username: cfg.Username,
            Password: cfg.Password,
        }).
        SetRetryWrites(cfg.RetryWrites).
        SetWriteConcern(writeconcern.Majority())
    client, err := mongo.Connect(context.Background(), connectOptions)
    if err != nil {
        return nil, err
    }
    db := client.Database(cfg.Database)
    return &mdb{
        client: client,
        dbConn: db,
    }, nil
}

func (m *mdb) ListPosts(ctx context.Context, req *persistence.ListPostsRequest) (*persistence.ListPostsResponse, error) {
    collection := m.dbConn.Collection("posts")
    opts := options.Find().SetSort(bson.D{{"created_at", -1}}).
        SetProjection(bson.M{"content": 0})
    cursor, err := collection.Find(ctx, bson.D{}, opts)
    if err != nil {
        return nil, err
    }

    var results []Post
    err = cursor.All(ctx, &results)
    if err != nil {
        return nil, err
    }

    var posts []*model.Post
    for _, r := range results {
        posts = append(posts, &model.Post{
            ID: r.ID,
            Slug: r.Slug,
            Title: r.Title,
            Author: r.Author,
            Summary: r.Summary,
            Tags: r.Tags,
            CreatedAt: r.CreatedAt,
            UpdatedAt: r.UpdatedAt,
        })
    }
    return &persistence.ListPostsResponse{
        Posts: posts,
    }, nil
}

func (m *mdb) GetPostByID(ctx context.Context, req *persistence.GetPostByIDRequest) (*persistence.GetPostByIDResponse, error) {
    collection := m.dbConn.Collection("posts")
    var post *Post
    err := collection.FindOne(ctx, bson.D{{"id", req.PostID}}).Decode(&post)
    if err != nil {
        if err == mongo.ErrNoDocuments {
            return nil, &errors.PostNotFoundError{PostID: req.PostID}
        }
        return nil, err
    }
    return &persistence.GetPostByIDResponse{
        Post: &model.Post{
            ID: post.ID,
            Slug: post.Slug,
            Title: post.Title,
            Author: post.Author,
            Content: post.Content,
            Summary: post.Summary,
            Tags: post.Tags,
            CreatedAt: post.CreatedAt,
            UpdatedAt: post.UpdatedAt,
        },
    }, nil
}

func (m *mdb) GetPostBySlug(ctx context.Context, req *persistence.GetPostBySlugRequest) (*persistence.GetPostBySlugResponse, error) {
    collection := m.dbConn.Collection("posts")
    var post *Post
    err := collection.FindOne(ctx, bson.D{{"slug", req.Slug}}).Decode(&post)
    if err != nil {
        if err == mongo.ErrNoDocuments {
            return nil, &errors.PostNotFoundError{Slug: req.Slug}
        }
        return nil, err
    }
    return &persistence.GetPostBySlugResponse{
        Post: &model.Post{
            ID: post.ID,
            Slug: post.Slug,
            Title: post.Title,
            Author: post.Author,
            Content: post.Content,
            Summary: post.Summary,
            Tags: post.Tags,
            CreatedAt: post.CreatedAt,
            UpdatedAt: post.UpdatedAt,
        },
    }, nil
}

func (m *mdb) GetSimilarSlugs(ctx context.Context, req *persistence.GetSimilarSlugsRequest) (*persistence.GetSimilarSlugsResponse, error) {
    collection := m.dbConn.Collection("posts")
    regexPattern := fmt.Sprintf("^%s(-\\d+)?$", regexp.QuoteMeta(req.BaseSlug))
    opts := options.Find().SetProjection(bson.M{"slug": 1, "_id": 0})
    cursor, err := collection.Find(ctx, bson.M{"slug": bson.M{"$regex": regexPattern}}, opts)
    if err != nil {
        return nil, err
    }
    defer cursor.Close(ctx)

    slugs := make(map[string]struct{})
    for cursor.Next(ctx) {
        var post Post
        if err := cursor.Decode(&post); err != nil {
            return nil, err
        }
        slugs[post.Slug] = struct{}{}
    }
    if err := cursor.Err(); err != nil {
        return nil, err
    }
    return &persistence.GetSimilarSlugsResponse{
        Slugs: slugs,
    }, nil
}

func (m *mdb) GetPostsByTag(ctx context.Context, req *persistence.GetPostsByTagRequest) (*persistence.GetPostsByTagResponse, error) {
    collection := m.dbConn.Collection("posts")
    opts := options.Find().SetSort(bson.D{{"created_at", -1}}).
        SetProjection(bson.M{"content": 0})
    cursor, err := collection.Find(ctx, bson.D{{"tags", req.Tag}}, opts)
    if err != nil {
        return nil, err
    }

    var results []Post
    err = cursor.All(ctx, &results)
    if err != nil {
        return nil, err
    }

    var posts []*model.Post
    for _, r := range results {
        posts = append(posts, &model.Post{
            ID: r.ID,
            Slug: r.Slug,
            Title: r.Title,
            Author: r.Author,
            Summary: r.Summary,
            Tags: r.Tags,
            CreatedAt: r.CreatedAt,
            UpdatedAt: r.UpdatedAt,
        })
    }
    return &persistence.GetPostsByTagResponse{
        Posts: posts,
    }, nil
}

func (m *mdb) GetTagCounts(ctx context.Context, req *persistence.GetTagCountsRequest) (*persistence.GetTagCountsResponse, error) {
    collection := m.dbConn.Collection("posts")
    pipeline := mongo.Pipeline{
        {{"$project", bson.D{
            {"tags", 1},
        }}},
        {{"$unwind", bson.D{{"path", "$tags"}}}},
        {{"$group", bson.D{
            {"_id", "$tags"},
            {"count", bson.D{{"$sum", 1}}},
        }}},
    }
    cursor, err := collection.Aggregate(ctx, pipeline)
    if err != nil {
        return nil, err
    }
    var tagCounts []TagCount
    err = cursor.All(ctx, &tagCounts)
    if err != nil {
        return nil, err
    }
    tagCountsMap := make(map[string]int64)
    for _, tc := range tagCounts {
        tagCountsMap[tc.Tag] = tc.Count
    }
    return &persistence.GetTagCountsResponse{
        TagCounts: tagCountsMap,
    }, nil
}

func (m *mdb) CreatePost(ctx context.Context, req *persistence.CreatePostRequest) (*persistence.CreatePostResponse, error) {
    collection := m.dbConn.Collection("posts")
    post := &Post{
        ID: req.Post.ID,
        Slug: req.Post.Slug,
        Title: req.Post.Title,
        Author: req.Post.Author,
        Content: req.Post.Content,
        Summary: req.Post.Summary,
        Tags: req.Post.Tags,
        CreatedAt: req.Post.CreatedAt,
        UpdatedAt: req.Post.UpdatedAt,
    }
    _, err := collection.InsertOne(ctx, post)
    if err != nil {
        if mongo.IsDuplicateKeyError(err) {
            return nil, &errors.PostAlreadyExistsError{PostID: req.Post.ID, Slug: req.Post.Slug}
        }
        return nil, err
    }
    return &persistence.CreatePostResponse{}, nil
}

func (m *mdb) UpdatePost(ctx context.Context, req *persistence.UpdatePostRequest) (*persistence.UpdatePostResponse, error) {
    collection := m.dbConn.Collection("posts")
    post := &Post{
        ID: req.Post.ID,
        Slug: req.Post.Slug,
        Title: req.Post.Title,
        Author: req.Post.Author,
        Content: req.Post.Content,
        Summary: req.Post.Summary,
        Tags: req.Post.Tags,
        UpdatedAt: req.Post.UpdatedAt,
    }
    result, err := collection.UpdateOne(ctx, bson.D{{"id", req.Post.ID}}, bson.D{{"$set", post}})
    if err != nil {
        return nil, err
    }
    if result.MatchedCount == 0 {
        return nil, &errors.PostNotFoundError{PostID: req.Post.ID}
    }
    return &persistence.UpdatePostResponse{}, nil
}

func (m *mdb) CountPosts(ctx context.Context, req *persistence.CountPostsRequest) (*persistence.CountPostsResponse, error) {
    collection := m.dbConn.Collection("posts")
    count, err := collection.CountDocuments(ctx, bson.D{})
    if err != nil {
        return nil, err
    }
    return &persistence.CountPostsResponse{Count: count}, nil
}

func (m *mdb) CreateUser(ctx context.Context, req *persistence.CreateUserRequest) (*persistence.CreateUserResponse, error) {
    collection := m.dbConn.Collection("users")
    user := &User{
        Username: req.User.Username,
        HashedPassword: req.User.HashedPassword,
        Salt: req.User.Salt,
        CreatedAt: req.User.CreatedAt,
        UpdatedAt: req.User.UpdatedAt,
    }
    _, err := collection.InsertOne(ctx, user)
    if err != nil {
        if mongo.IsDuplicateKeyError(err) {
            return nil, &errors.UserAlreadyExistsError{Username: req.User.Username}
        }
        return nil, err
    }
    return &persistence.CreateUserResponse{}, nil
}

func (m *mdb) GetUser(ctx context.Context, req *persistence.GetUserRequest) (*persistence.GetUserResponse, error) {
    collection := m.dbConn.Collection("users")
    var user *User
    err := collection.FindOne(ctx, bson.D{{"username", req.Username}}).Decode(&user)
    if err != nil {
        if err == mongo.ErrNoDocuments {
            return nil, &errors.UserNotExistsError{Username: req.Username}
        }
        return nil, err
    }
    return &persistence.GetUserResponse{
        User: &model.User{
            Username: user.Username,
            HashedPassword: user.HashedPassword,
            Salt: user.Salt,
            CreatedAt: user.CreatedAt,
            UpdatedAt: user.UpdatedAt,
        },
    }, nil
}
