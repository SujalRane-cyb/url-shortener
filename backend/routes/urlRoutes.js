const express = require("express");
const router = express.Router();
const ShortUrl = require("../models/Url"); // Ensure model file name matches

// ✅ Shorten URL Endpoint
router.post("/shorten", async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ error: "❌ URL is required!" });

        // Check if URL already exists to prevent duplicates
        let existingUrl = await ShortUrl.findOne({ originalUrl: url });
        if (existingUrl) {
            return res.json({ short: existingUrl.shortCode });
        }

        // Create new short URL
        let shortUrl = new ShortUrl({ originalUrl: url });
        await shortUrl.save();
        
        res.json({ short: shortUrl.shortCode });

    } catch (err) {
        console.error("❌ Error in /shorten:", err);
        res.status(500).json({ error: "❌ Internal Server Error" });
    }
});

// ✅ Redirect Short URL
router.get("/:shortCode", async (req, res) => {
    try {
        let foundUrl = await ShortUrl.findOne({ shortCode: req.params.shortCode });

        if (foundUrl) {
            return res.redirect(foundUrl.originalUrl);
        }
        res.status(404).json({ error: "❌ URL Not Found" });

    } catch (err) {
        console.error("❌ Error in /:shortCode:", err);
        res.status(500).json({ error: "❌ Internal Server Error" });
    }
});

module.exports = router;
