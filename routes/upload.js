const { Router } = require("express");
const uploadMiddleware = require("../middlewares/MulterMiddleware");
const UploadModel = require("../models/UploadModel");

const router = Router();

router.get("/api/get", async (req, res) => {
  try {
    const allPhotos = await UploadModel.find()
      .sort({ createdAt: "descending" })
      .select("photo title description takenBy"); // Include "takenBy" field in the select statement
    res.send(allPhotos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/api/save", uploadMiddleware.single("photo"), (req, res) => {
  const { file, body } = req;
  const { title, description, takenBy } = body;

  const photo = file.filename;

  UploadModel.create({ photo, title, description, takenBy })
    .then((data) => {
      console.log("Uploaded Successfully...");
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
    });
});

router.post("/api/upload", uploadMiddleware.single("photo"), (req, res) => {
  // Handle the upload logic and save the uploaded image
  // You can reuse the same logic as the "/api/save" endpoint

  // Example code:
  const { file, body } = req;
  const { title, description, takenBy } = body;

  const photo = file.filename;

  UploadModel.create({ photo, title, description, takenBy })
    .then((data) => {
      console.log("Uploaded Successfully...");
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
    });
});

module.exports = router;
