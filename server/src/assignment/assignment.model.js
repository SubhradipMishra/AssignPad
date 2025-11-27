import { model, Schema } from "mongoose";

const AssignmentSchema = new Schema({
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
  path:{
    type:String,
    default:"",
  }
}, { timestamps: true });

const AssignmentModel = model("Assignment",AssignmentSchema) ; 

export default AssignmentModel ;
