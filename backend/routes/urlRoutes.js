const express = require("express");
const router = express.Router();
const ShortUrl = require("../models/ShortUrl");

// Shorten URL Endpoint
router.post("/shorten", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
        let shortUrl = new ShortUrl({ longUrl: url });
        await shortUrl.save();
        res.json({ short: shortUrl.id });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Redirect Short URL
router.get("/:shortId", async (req, res) => {
    try {
        let foundUrl = await ShortUrl.findOne({ _id: req.params.shortId });
        if (foundUrl) res.redirect(foundUrl.longUrl);
        else res.status(404).json({ error: "Not Found" });
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
