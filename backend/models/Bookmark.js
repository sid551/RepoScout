import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["repo", "issue"],
    default: "repo",
  },
  // Repo fields
  repoId: { type: String },
  repoName: { type: String },
  description: { type: String },
  stars: { type: Number, default: 0 },
  language: { type: String },
  url: { type: String, required: true },
  // Issue fields
  issueId: { type: String },
  issueTitle: { type: String },
  issueRepo: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

bookmarkSchema.index({ userId: 1, repoId: 1 }, { unique: true, sparse: true });
bookmarkSchema.index({ userId: 1, issueId: 1 }, { unique: true, sparse: true });

export default mongoose.model("Bookmark", bookmarkSchema);
