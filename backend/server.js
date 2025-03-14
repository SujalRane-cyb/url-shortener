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
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);  // Exit process if MongoDB connection fails
  });

// API Route to Shorten URLs
app.post("/shorten", async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ error: "❌ URL is required!" });

        let existingUrl = await URL.findOne({ originalUrl: url });

        if (existingUrl) {
            return res.json({ short: existingUrl.shortCode });
        }

        const shortCode = shortid.generate();
        const newUrl = new URL({ originalUrl: url, shortCode });

        await newUrl.save();
        res.json({ short: shortCode });

    } catch (error) {
        console.error("❌ Error in /shorten:", error);
        res.status(500).json({ error: "❌ Internal server error!" });
    }
});

// Redirect Short URLs
app.get("/:shortCode", async (req, res) => {
    try {
        const urlData = await URL.findOne({ shortCode: req.params.shortCode });
        if (urlData) {
            return res.redirect(urlData.originalUrl);
        }
        res.status(404).json({ error: "❌ URL not found!" });

    } catch (error) {
        console.error("❌ Error in redirect:", error);
        res.status(500).json({ error: "❌ Internal server error!" });
    }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
