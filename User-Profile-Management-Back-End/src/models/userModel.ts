import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  strength: {
    type: [String],
    required: true,
  },
  about: {
    type: String,
  },
  role: {
    type: String,
    required: true,
  },
});

// Hash the password before saving to the database
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    return next();
  } catch (error) {
    throw new Error("Error while hashing the password " + error);
  }
});

export default mongoose.model("User", userSchema);
