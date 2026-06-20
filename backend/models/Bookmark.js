import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  repoId: { type: String, required: true },
  repoName: { type: String, required: true },
  description: { type: String },
  stars: { type: Number, default: 0 },
  language: { type: String },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

bookmarkSchema.index({ userId: 1, repoId: 1 }, { unique: true });

export default mongoose.model("Bookmark", bookmarkSchema);
