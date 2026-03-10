# 🐦 X Tweet URL Collector

A Chrome extension that collects all tweet URLs from any X (Twitter) profile page with one click.
Built as a companion tool for [X Profile Analyzer](https://github.com/Osifo1/x-profile-analyzer).

---

## ✨ What It Does

- Opens on any X profile page
- Scans the page and collects all visible tweet URLs instantly
- Filters out junk links (analytics, photos, videos)
- Copy all URLs to clipboard with one click
- Open X Profile Analyzer directly from the extension

---

## 🚀 How To Use

1. Go to any public X profile page e.g. `x.com/username`
2. Scroll down to load as many tweets as you want to analyze
3. Click the **X Tweet URL Collector** icon in your Chrome toolbar
4. Click **"Collect Tweet URLs"**
5. Click **"Copy All URLs"**
6. Paste into [X Profile Analyzer](https://github.com/Osifo1/x-profile-analyzer)
7. Click Analyze and get your insights

---

## 📦 Installation

This extension is not yet on the Chrome Web Store.
Install it manually in Developer Mode:

1. Download or clone this repo
2. Open Chrome and go to `chrome://extensions`
3. Turn on **Developer Mode** (top right toggle)
4. Click **"Load Unpacked"**
5. Select the `x-url-collector` folder
6. The extension appears in your toolbar

---

## 🗂 File Structure
```
x-url-collector/
├── manifest.json     → Chrome extension config
├── content.js        → Runs on x.com, scans DOM for tweet URLs
├── popup.html        → Extension popup UI
├── popup.js          → Popup logic and clipboard handling
└── icon.png          → Extension icon
```

---

## ⚙️ How It Works

When you click **Collect**, the popup sends a message to `content.js` which is
running on the active X tab. `content.js` scans all anchor tags on the page,
filters for valid tweet URLs matching the pattern `/status/[digits]`, removes
duplicates, and returns the clean list to the popup.

Since X loads tweets lazily as you scroll, the extension only sees tweets
that are currently loaded in the DOM. Scroll further down before collecting
to get more URLs.

---

## 🔗 Part of X Profile Analyzer

This extension is designed to work with the
[X Profile Analyzer](https://github.com/Osifo1/x-profile-analyzer) app.

Collect URLs here → Paste into X Profile Analyzer → Get full analysis

---

## 👤 Author

Built by [Osifo Goodness](https://github.com/Osifo1)