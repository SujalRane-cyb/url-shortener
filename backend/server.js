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
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit if connection fails
  });

// API Route to Shorten URLs
app.post("/shorten", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "❌ URL is required!" });

    // Check if URL already exists
    let existingUrl = await URL.findOne({ originalUrl: url });
    if (existingUrl) {
      return res.json({ short: existingUrl.shortCode });
    }

    // Generate Short Code
    const shortCode = shortid.generate();
    const newUrl = new URL({ originalUrl: url, shortCode });
    await newUrl.save();

    res.json({ short: shortCode });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "❌ Server error!" });
  }
});

// Redirect Short URLs
app.get("/:shortCode", async (req, res) => {
  try {
    const urlData = await URL.findOne({ shortCode: req.params.shortCode });
    if (urlData) {
      return res.redirect(urlData.originalUrl);
    } else {
      return res.status(404).json({ error: "❌ URL not found!" });
    }
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ error: "❌ Server error!" });
  }
});

// **Ensure API is Served Properly**
app.use(express.static("public")); // (Optional, if you have static assets)

// Start Server
app.listen(PORT, () => console.log(`🚀 API Server running on port ${PORT}`));
