const mongoose = require("mongoose");

// MongoDB Atlas Connection String (Replace <username> and <password>)
const mongoURI = "mongodb+srv://justprojects:Project@$12@cluster0.573fs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connected to MongoDB Atlas"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

const urlSchema = new mongoose.Schema({
    longUrl: String,
    shortUrl: String
});

const Url = mongoose.model("Url", urlSchema);

module.exports = Url;
