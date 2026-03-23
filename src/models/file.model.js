import mongoose from "mongoose";
const fileSchema = new mongoose.Schema(
  {
    filename: String,
    originalName: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);
const fileModel = mongoose.model("file", fileSchema);
export default fileModel;
