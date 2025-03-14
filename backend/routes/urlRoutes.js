const express = require("express");
const Url = require("../database"); // Import MongoDB Model
const router = express.Router();

// Generate Short URL
router.post("/shorten", async (req, res) => {
    const { longUrl } = req.body;
    if (!longUrl) return res.status(400).json({ error: "URL is required" });

    const shortUrl = Math.random().toString(36).substr(2, 6); // Random 6-character string
    const newUrl = new Url({ longUrl, shortUrl });

    try {
        await newUrl.save();
        res.json({ shortUrl: `https://${req.hostname}/${shortUrl}` });
    } catch (error) {
        res.status(500).json({ error: "Failed to save URL" });
    }
});

// Redirect Short URL
router.get("/:shortUrl", async (req, res) => {
    try {
        const url = await Url.findOne({ shortUrl: req.params.shortUrl });
        if (!url) return res.status(404).json({ error: "Not found" });
        res.redirect(url.longUrl);
    } catch (error) {
        res.status(500).json({ error: "Error processing request" });
    }
});

module.exports = router;
