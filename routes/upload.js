const { Router } = require("express");
const uploadMiddleware = require("../middlewares/MulterMiddleware");
const UploadModel = require("../models/UploadModel");

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from Upload route");
});


router.get("/api/get", async (req, res) => {
  try {
    const allPhotos = await UploadModel.find()
      .sort({ createdAt: "descending" })
      .select("photo title description takenBy");
    res.send(allPhotos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/api/save", uploadMiddleware.single("photo"), (req, res) => {
  const { file, body } = req;
  console.log("File:", file);
  console.log("Req File:", req.file);
  const { title, description, takenBy } = body;

  const photo = file.filename;

  UploadModel.create({ photo, title, description, takenBy })
    .then((data) => {
      console.log("Uploaded Successfully...");
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      console.log(err); // Log the error details
      res.status(500).json({ message: "Server Error" });
    });
});

router.post("/api/upload", uploadMiddleware.single("photo"), (req, res) => {
  const { file, body } = req;
  console.log("File:", file);
  console.log("Req File:", req.file);
  const { title, description, takenBy } = body;

  const photo = file.filename;

  UploadModel.create({ photo, title, description, takenBy })
    .then((data) => {
      console.log("Uploaded Successfully...");
      console.log(data);
      res.status(200).json(data); // Set the response status code to 200 and send the data as JSON
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Server Error" }); // Set the response status code to 500 and send an error message
    });
});


module.exports = router;
