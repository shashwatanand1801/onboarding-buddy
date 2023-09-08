const express = require("express");
const router = express.Router();

const bodyParser = require('body-parser')
jsonParser = bodyParser.json();

const dbController = require("../controller/db")

console.log("Router")

router.post("/get-candidate-info", jsonParser, dbController.getCandidateInfo)

router.post("/add-candidate-info", jsonParser, dbController.addCandidateInfo)


module.exports = router;