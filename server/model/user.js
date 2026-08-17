import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, default: "Anonymous" },
    age: { type: String },
    occupation: { type: String },
    year: { type: String, default: "0" },
    stack: { type: [String] },
    applications: [
      {
        jobTitle: { type: String, required: true },
        skill: { type: String, default: "" },
        link: String,
        submittedAt: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ["pending", "interviewing", "rejected", "accepted"],
          default: "pending",
        },
        note: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
