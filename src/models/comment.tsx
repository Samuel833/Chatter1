import { Schema, model, models } from "mongoose";

//model - based on schema - each instance is a new document
const commentSchema = new Schema({
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  postId: [{ type: Schema.Types.ObjectId, required: true, ref: "Post" }],
  parentId: [{ type: Schema.Types.ObjectId, ref: "Comment", default: null }],
  author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Comment = models.Comment || model("Comment", commentSchema);

export default  Comment //returns a constructor function