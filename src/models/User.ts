import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["admin", "editor", "viewer"], 
    default: "viewer" 
  },
  createdAt: { type: Date, default: Date.now },
});

export default models.User || model("User", UserSchema);