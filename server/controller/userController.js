import mongoose from "mongoose";
import User from "../model/user.js";
import { generateToken } from "../utils/auth.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = new User({
      username: username,
      password: password,
      email: email,
    });
    await user.save();
    const token = generateToken(user);
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    return res.status(500).json({ Error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(401).json({ message: "Invalid Credentials" });
    const isMatch = await existingUser.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Password is incorrect" });
    const token = generateToken(existingUser);
    const isProd = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
    res.status(200).json({
      message: "Login successful",
      user: { id: existingUser._id, username: existingUser.username },
    });
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", { path: "/" });
  res.json({ message: "Logged out successfully" });
};

export const addApplication = async (req, res) => {
  try {
    const userId = req.user._id;
    const { jobTitle, skill, link, status, note } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          applications: {
            jobTitle,
            skill: skill || "",
            link: link || "No link provided",
            submittedAt: new Date(),
            status: status || "pending",
            note: note || "",
          },
        },
      },
      { new: true },
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(201).json({
      message: "Application submitted",
      application: user.applications[user.applications.length - 1],
    });
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
};

export const getAllApplicationData = async (req, res) => {
  try {
    const userID = req.user._id;
    const user = await User.findById(userID).select("applications");
    if (!user) {
      return res.status(400).json({ message: "No user found" });
    }
    res.status(200).json(user.applications);
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
};

export const getUserData = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-applications");
    if (!user) {
      return res.status(400).json({ message: "No user found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
};

export const updateUserData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { username, password, email, name, age, occupation, year, stack } =
      req.body;
    const user = await User.findByIdAndUpdate(userId, {
      username: username,
      password: password,
      email: email,
      name: name,
      age: age,
      occupation: occupation,
      year: year,
      stack: stack,
    });

    if (!user || user.length === 0)
      return res.status(404).json({ message: "User not found" });

    user.save();
    res.status(200).json({ Message: "Profile updated" });
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
};

export const getSpecificApplicationData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { requestedData } = req.body;

    const user = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $project: {
          name: 1,
          matchedApplications: {
            $filter: {
              input: "$applications",
              as: "app",
              cond: { $eq: ["$$app.status", requestedData] },
            },
          },
        },
      },
    ]);

    if (!user || user.length === 0)
      return res.status(404).json({ message: "User not found" });

    // Return just the filtered array
    res.status(200).json(user[0].matchedApplications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getNumberOfApplication = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).select("applications");
    const numberOfApplication = {
      interviewingNumber: 0,
      acceptedNumber: 0,
    };
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const applications = user.applications || [];
    for (let i = 0; i < applications.length; i++) {
      const app = applications[i];
      if (app.status === "interviewing")
        numberOfApplication.interviewingNumber += 1;
      else if (app.status === "accepted")
        numberOfApplication.acceptedNumber += 1;
    }
    res.status(200).json(numberOfApplication);
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
};

export const updateApplication = async (req, res) => {
  const { applicationId, jobTitle, skill, link, status, note } = req.body;
  const userId = req.user._id;
  try {
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: userId,
        "applications._id": applicationId,
      },
      {
        $set: {
          "applications.$.jobTitle": jobTitle,
          "applications.$.skill": skill,
          "applications.$.link": link,
          "applications.$.status": status,
          "applications.$.note": note,
        },
      },
      {
        new: true,
      },
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User or Application not found" });
    }

    res.status(200).json({
      message: "Application updated successfully",
      updatedApplication: updatedUser.applications.id(applicationId),
    });
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
};

export const deleteApplication = async (req, res) => {
  const { applicationId } = req.body;
  const userId = req.user._id;

  try {
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: userId,
        "applications._id": applicationId,
      },
      {
        $pull: {
          applications: { _id: applicationId },
        },
      },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User or Application not found" });
    }

    res.status(200).json({
      message: "Application deleted successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
