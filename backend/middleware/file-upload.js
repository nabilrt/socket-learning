const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ dest: "uploads/" }).single("file");

module.exports = upload;
