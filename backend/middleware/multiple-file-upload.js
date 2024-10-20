const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ dest: "uploads/" }).array("files", 10); // You can set a limit of files (10 in this case)

module.exports = upload;
