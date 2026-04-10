import mongoose from "mongoose";

const SavedBuildSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  buildId: { type: String, required: true },
  title: { type: String, required: true },
  useCase: { type: String },
  totalPrice: { type: Number },
  parts: { type: Object, required: true },
  savedAt: { type: Date, default: Date.now },
});

SavedBuildSchema.index({ userId: 1, buildId: 1 }, { unique: true });

export const SavedBuild =
  mongoose.models.SavedBuild || mongoose.model("SavedBuild", SavedBuildSchema);
