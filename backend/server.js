const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const urlRoutes = require("./routes/urlRoutes"); // Import routes

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// MongoDB Connection
const mongoURI = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/urlShortener?retryWrites=true&w=majority";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Use Routes
app.use("/", urlRoutes);

app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
