import { Schema, model, models } from "mongoose";


const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        author: { type: Schema.Types.ObjectId, ref: 'User' },
        content: {
            type: String,
            required: true,
        },
        imageURL: {
            type: String,
            required: true,
        },
        date: { type: Date, default: Date.now },
        titleURL: {
          type: String
        },
        tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
        views: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
        likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        bookmarks: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        comments: [{ type: Schema.Types.ObjectId, required: true, ref: 'Comment' }],
        usersSaved: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        usersLiked: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
)

const Post = models.Post || model('Post', postSchema)

export default Post;