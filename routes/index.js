const express = require("express");
const router = express.Router();

const ctrlTable = require("../controllers/table");
const ctrlArchive = require("../controllers/archive");
const ctrlProgress = require("../controllers/progress");
const ctrlHistory = require("../controllers/history");

router.get("/evas", ctrlTable.getEvas);
router.get("/history-evas", ctrlHistory.getPastEvas);
router.get("/dark-evas", ctrlArchive.getDarkEvas);
router.post("/dark-eva", ctrlArchive.setDarkEva);
router.get("/progress", ctrlProgress.getProgress);
router.post("/eva", ctrlTable.addEva);
router.post("/updateEva", ctrlTable.setEva);
router.post("/archive", ctrlTable.archiveEva);
router.post("/move", ctrlTable.moveEva);
router.post("/moveInDark", ctrlArchive.moveDarkEva);
router.get("/all-evas", ctrlProgress.getAllEvas);
router.delete("/initProgress", ctrlProgress.initProgress);

module.exports = router;