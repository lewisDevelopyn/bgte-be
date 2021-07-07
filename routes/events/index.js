const { Router } = require("express");
const router = new Router();
const eventsController = require("./controller");
const auth = require('../../auth');

var multer = require("multer");
var upload = multer({ dest: "uploads/" });

router.get("/", eventsController.getEvents);

router.get("/by_id", eventsController.getEvent);

router.post("/upload", auth.authenticateToken, upload.single("csv_data"), eventsController.uploadEvent);

module.exports = router;
