const backendUrl = "https://url-shortener-theta-brown.vercel.app/";  // ✅ Replace with your actual Vercel backend URL

// Function to paste a URL from clipboard
function pasteLink() {
    navigator.clipboard.readText()
        .then(text => {
            document.getElementById("urlInput").value = text;
        })
        .catch(err => {
            console.error("Clipboard read failed: ", err);
        });
}

// Function to shorten the URL
async function shortenUrl() {
    let longUrl = document.getElementById("urlInput").value;
    
    if (!longUrl) {
        alert("Please enter a valid URL.");
        return;
    }

    try {
        let response = await fetch(`${backendUrl}/shorten`, {  // ✅ Using Vercel backend
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: longUrl })
        });

        let data = await response.json();

        if (data.short) {
            let shortUrl = `${backendUrl}/${data.short}`;
            document.getElementById("shortUrlLink").href = shortUrl;
            document.getElementById("shortUrlLink").textContent = shortUrl;
            document.getElementById("result").style.display = "block";
            document.getElementById("successMessage").style.display = "block"; // ✅ Show success message
        } else {
            alert("Error: " + (data.error || "Could not shorten URL"));
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to shorten URL.");
    }
}

// Function to copy shortened URL to clipboard
function copyShortUrl() {
    let shortUrl = document.getElementById("shortUrlLink").href;
    
    navigator.clipboard.writeText(shortUrl)
        .then(() => {
            alert("Copied to clipboard!");
        })
        .catch(err => {
            console.error("Clipboard copy failed: ", err);
        });
}

// Function to handle testimonial submission
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
