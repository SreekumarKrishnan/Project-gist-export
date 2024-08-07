import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({

  description: { type: String, required: true },
  projectId: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }
},
{ timestamps: true }
);

export default mongoose.model("Todo", todoSchema);