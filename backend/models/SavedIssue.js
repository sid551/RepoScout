import mongoose from "mongoose";

const savedIssueSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  issueId: { type: String, required: true },
  issueTitle: { type: String, required: true },
  issueRepo: { type: String },
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

savedIssueSchema.index({ userId: 1, issueId: 1 }, { unique: true });

export default mongoose.model("SavedIssue", savedIssueSchema);
