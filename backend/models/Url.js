const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortCode: { type: String, unique: true, required: true }
});

module.exports = mongoose.model("URL", urlSchema);
