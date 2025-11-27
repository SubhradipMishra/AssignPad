import { model, Schema } from "mongoose";

const HistorySchema = new Schema(
  {
    status: String,
    message: String,
    changedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    changedByName: {
      type: String,
    },
    submittedDate: {
      type: Date,
      default: Date.now,
    },
    filePath: String,
  },
  { timestamps: true }
);


const AssignmentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      lowercase: true,
    },
    category: {
      type: String,
      default: "assignment",
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      default: "submitted",
    },
    submittedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    path: {
      type: String,
      default: "",
    },

    // ----------------------------------
    // ⭐ NEW: History Log
    // ----------------------------------
    history: {
      type: [HistorySchema],
      default: [],
    },
  },
  { timestamps: true }
);

const AssignmentModel = model("Assignment", AssignmentSchema);

export default AssignmentModel;
