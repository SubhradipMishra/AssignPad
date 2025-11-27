import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema({
  fullname: {
    type: String,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,

    lowercase: true,
    unique:true ,
  },

  phoneno:{
    type:String,
    required:true,
  },
  department:{
    type:String,
    default:"enginnering",

  },



  role: {
    type: String,
    default: "admin",
  },
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const encrypted = await bcrypt.hash(this.password, 12);
  this.password = encrypted;
  next();
});

const UserModel = model("User", UserSchema);

export default UserModel;
