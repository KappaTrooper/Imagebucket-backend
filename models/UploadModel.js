const mongoose = require("mongoose");

const uploadPhotoSchema = new mongoose.Schema(
  {
    photo: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("UploadPhoto", uploadPhotoSchema);