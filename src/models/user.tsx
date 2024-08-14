import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  avatar: {
    type: String,
    default: "",
  },
  coverphoto: {
    type: String,
    default: "",
  },
  username: { 
    type: String, 
    trim: true
  },
  password: { 
    type: String, 
    trim: true 
  },
  email: { 
    type: String, 
    trim: true, 
    unique: true, 
    required: true 
  },
  bio: { type: String },
  links: { type: String },
  joinDate: { type: Date, default: Date.now },
  location: { type: String },
  work: { type: String },
  skills: { type: String },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  liked: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  viewed: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  followedTags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  bookmarks: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  resetToken: { type: String },
  resetTokenExpires: { type: Date },

}, {timestamps: true});

const User = models.User || model("User", userSchema);
export default User;