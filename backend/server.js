require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const shortid = require("shortid");
const URL = require("./models/Url");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// API Route to Shorten URLs
app.post("/shorten", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "❌ URL is required!" });

    const shortCode = shortid.generate();
    const newUrl = new URL({ originalUrl: url, shortCode });

    try {
        await newUrl.save();
        res.json({ short: shortCode });
    } catch (error) {
        res.status(500).json({ error: "❌ Server error!" });
    }
});

// Redirect Short URLs
app.get("/:shortCode", async (req, res) => {
    try {
        const urlData = await URL.findOne({ shortCode: req.params.shortCode });
        if (urlData) res.redirect(urlData.originalUrl);
        else res.status(404).json({ error: "❌ URL not found!" });
    } catch (error) {
        res.status(500).json({ error: "❌ Server error!" });
    }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
