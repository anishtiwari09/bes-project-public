import mongoose from "mongoose";

export const visitorCounter = new mongoose.Schema({
  numberOfVisitor: {
    type: Number,
    default: 0,
    required: true,
  },
});

const VisitorCounter =
  mongoose.models.visitorCounter ||
  mongoose.model("visitorCounter", visitorCounter);
export default VisitorCounter;
