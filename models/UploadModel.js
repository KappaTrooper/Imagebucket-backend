const mongoose = require("mongoose");

const uploadPhotoSchema = new mongoose.Schema(
  {
    photo: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    takenBy: {
      type: String, // Update the data type according to your requirements
      required: true,
    },
    userID: {
      type: String, // Update the data type according to your requirements
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    impressions: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UploadPhoto", uploadPhotoSchema);
