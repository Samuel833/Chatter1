// import { Schema, model, models } from "mongoose";
// //schema = blueprint of post (it must contain title, image, etc.)


// //model - based on schema - each instance is a new document
// const tagSchema = new Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   date: { type: Date, default: Date.now },
//   posts: [{ type: Schema.Types.ObjectId, required: true, ref: "Post" }],
//   followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
// });

// const Tag = models.Tag || model("Tag", tagSchema);

// export default Tag; //returns a constructor function



import mongoose from 'mongoose';

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  }],
});

const Tag = mongoose.models.Tag || mongoose.model('Tag', TagSchema);
export default Tag;
