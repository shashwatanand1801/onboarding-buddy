const mongoose = require("mongoose");

const dbSchema = new mongoose.Schema(
  {
    email: String,
    candidateName: String,
    skills: Object
  },
  { timestamps: true }
);

const dbModel = mongoose.model("studentInfo", dbSchema);
module.exports = dbModel;
