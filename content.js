// content.js
// This script runs directly on x.com pages
// It scans the DOM for all tweet links and returns them to the popup
// Twitter/X renders tweet links as anchors with /status/ in the href
// We collect all unique ones visible on the current page

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "collectURLs") {

        // Find all anchor tags on the page
        const allLinks = document.querySelectorAll('a[href]');

        const tweetURLs = new Set();

        allLinks.forEach(link => {
            const href = link.href;

            // Only keep links that match the tweet URL pattern
            // Pattern: x.com/username/status/numericsid
            if (href && href.match(/https:\/\/(x|twitter)\.com\/\w+\/status\/\d+$/) 
    && !href.includes('/analytics')
    && !href.includes('/photo')
    && !href.includes('/video')
    && !href.includes('/retweets')
    && !href.includes('/likes')) {
                // Clean the URL — remove query parameters like ?s=20
                const cleanURL = href.split('?')[0];
                tweetURLs.add(cleanURL);
            }
        });

        // Convert Set to Array and send back to popup
        const urlArray = Array.from(tweetURLs);

        sendResponse({
            success: true,
            urls: urlArray,
            count: urlArray.length
        });
    }

    // Return true to keep the message channel open for async response
    return true;
});