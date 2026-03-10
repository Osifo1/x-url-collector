// popup.js
// Handles all the logic inside the extension popup window
// Communicates with content.js to collect URLs from the active tab
// Displays collected URLs and handles copy to clipboard

// Your live X Analyzer app URL — update this when you have the final Lovable URL
const ANALYZER_URL = "https://your-lovable-app-url.lovable.app";

// ── DOM references ────────────────────────────────────────────────────
const collectBtn = document.getElementById("collectBtn");
const copyBtn = document.getElementById("copyBtn");
const copyAnalyzerBtn = document.getElementById("copyAnalyzerBtn");
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");
const urlListEl = document.getElementById("urlList");
const countBadge = document.getElementById("countBadge");
const analyzerLink = document.getElementById("analyzerLink");

// Set analyzer link in footer
analyzerLink.href = ANALYZER_URL;
analyzerLink.target = "_blank";

let collectedURLs = [];

// ── Helper: show status message ───────────────────────────────────────
function setStatus(message, type = "") {
    statusEl.textContent = message;
    statusEl.className = "status " + type;
}

// ── Helper: render URL list ───────────────────────────────────────────
function renderURLs(urls) {
    urlListEl.innerHTML = "";
    urls.forEach(url => {
        const div = document.createElement("div");
        div.className = "url-item";
        div.textContent = url;
        urlListEl.appendChild(div);
    });
}

// ── Collect button click ──────────────────────────────────────────────
collectBtn.addEventListener("click", async () => {
    setStatus("Scanning page for tweet URLs...");
    collectBtn.disabled = true;

    try {
        // Get the current active tab
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

        // Check if we're on X or Twitter
        if (!tab.url.includes("x.com") && !tab.url.includes("twitter.com")) {
            setStatus("Please open an X profile page first", "error");
            collectBtn.disabled = false;
            return;
        }

        // Send message to content.js to collect URLs
        const response = await chrome.tabs.sendMessage(tab.id, {
            action: "collectURLs"
        });

        if (response && response.success && response.urls.length > 0) {
            collectedURLs = response.urls;
            countBadge.textContent = collectedURLs.length;
            renderURLs(collectedURLs);
            resultsEl.classList.remove("hidden");
            setStatus(
                `Found ${collectedURLs.length} tweet URLs on this page`,
                "success"
            );
        } else {
            setStatus(
                "No tweet URLs found. Try scrolling down to load more tweets first.",
                "error"
            );
        }

    } catch (error) {
        setStatus(
            "Could not scan page. Try refreshing the X profile page.",
            "error"
        );
        console.error(error);
    }

    collectBtn.disabled = false;
});

// ── Copy all URLs button ──────────────────────────────────────────────
copyBtn.addEventListener("click", async () => {
    if (collectedURLs.length === 0) return;

    const text = collectedURLs.join("\n");

    try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = "✅ Copied to clipboard!";
        copyBtn.classList.add("btn-success");

        // Reset button after 2 seconds
        setTimeout(() => {
            copyBtn.innerHTML = `📋 Copy All URLs <span id="countBadge" class="count-badge">${collectedURLs.length}</span>`;
            copyBtn.classList.remove("btn-success");
        }, 2000);

    } catch (error) {
        setStatus("Could not copy. Try again.", "error");
    }
});

// ── Open Analyzer button ──────────────────────────────────────────────
copyAnalyzerBtn.addEventListener("click", async () => {
    if (collectedURLs.length === 0) return;

    // Copy URLs to clipboard first
    const text = collectedURLs.join("\n");
    await navigator.clipboard.writeText(text);

    // Open X Analyzer in a new tab
    chrome.tabs.create({ url: ANALYZER_URL });

    setStatus("URLs copied! Paste them into X Analyzer.", "success");
});