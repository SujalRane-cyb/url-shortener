function pasteLink() {
    navigator.clipboard.readText().then(text => {
        document.getElementById("urlInput").value = text;
    }).catch(err => {
        console.error("Clipboard read failed: ", err);
    });
}

async function shortenUrl() {
    let longUrl = document.getElementById("urlInput").value;
    if (!longUrl) {
        alert("Please enter a valid URL.");
        return;
    }

    try {
        let response = await fetch("https://your-vercel-backend-url.vercel.app/shorten", { // 🔹 Update this URL
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ longUrl }) // 🔹 Corrected request body
        });

        let data = await response.json();
        if (data.shortUrl) {
            let shortUrl = data.shortUrl;
            document.getElementById("shortUrlLink").href = shortUrl;
            document.getElementById("shortUrlLink").textContent = shortUrl;
            document.getElementById("result").style.display = "block";
            document.getElementById("successMessage").style.display = "block"; // Show success message
        } else {
            alert("Error: " + (data.error || "Could not shorten URL"));
        }
    } catch (error) {
        console.error("Error shortening URL:", error);
        alert("Failed to shorten URL. Please try again.");
    }
}

function copyShortUrl() {
    let shortUrl = document.getElementById("shortUrlLink").href;
    navigator.clipboard.writeText(shortUrl).then(() => {
        alert("Copied to clipboard!");
    }).catch(err => {
        console.error("Copy failed: ", err);
    });
}

function submitTestimonial() {
    let name = document.getElementById("name").value;
    let message = document.getElementById("message").value;

    if (name.trim() === "" || message.trim() === "") {
        alert("Please enter both your name and feedback.");
        return;
    }

    alert("Thank you for your feedback, " + name + "!");
    document.getElementById("name").value = "";
    document.getElementById("message").value = "";
}
