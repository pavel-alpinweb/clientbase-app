const express = require("express");
const router = express.Router();

const ctrlTable = require("../controllers/table");
const ctrlArchive = require("../controllers/archive");
const ctrlProgress = require("../controllers/progress");

router.get("/evas", ctrlTable.getEvas);
router.get("/dark-evas", ctrlArchive.getDarkEvas);
router.post("/dark-eva", ctrlArchive.setDarkEva);
router.get("/progress", ctrlProgress.getProgress);
router.post("/eva", ctrlTable.addEva);
router.post("/updateEva", ctrlTable.setEva);
router.post("/archive", ctrlTable.archiveEva);
router.post("/initProgress", ctrlProgress.initProgress);
router.post("/move", ctrlTable.moveEva);
router.post("/moveInDark", ctrlArchive.moveDarkEva);

module.exports = router;