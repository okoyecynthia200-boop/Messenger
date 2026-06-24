const User = require("../Models/UserModel");

exports.searchUsers = async (req, res) => {
  try {
    const { username = "" } = req.query;

    const users = await User.find({
      username: { $regex: username.toLowerCase(), $options: "i" },
      _id: { $ne: req.user._id },
    }).select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username.toLowerCase(),
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User doesnt exist",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = {};

    if (typeof req.body.username === "string") {
      const username = req.body.username.trim().toLowerCase();
      if (!username) {
        return res.status(400).json({ message: "Username is required" });
      }

      const existingUser = await User.findOne({
        username,
        _id: { $ne: req.user._id },
      });

      if (existingUser) {
        return res.status(400).json({ message: "Username is already taken" });
      }

      updates.username = username;
    }

    if (typeof req.body.avatar === "string") {
      updates.avatar = req.body.avatar;
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: "No profile changes supplied" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true },
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
