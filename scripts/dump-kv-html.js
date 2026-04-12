/**
 * Dumps kv.ee broker page HTML for selector inspection.
 * Run: node scripts/dump-kv-html.js
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 900 },
    locale: "et-EE",
  });
  const page = await context.newPage();
  await page.goto("https://www.kv.ee/broker/kevinkristoferlaanmets", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(5000);

  const html = await page.content();
  const outPath = path.join(__dirname, "../data/kv-dump.html");
  fs.writeFileSync(outPath, html);
  console.log("Saved to data/kv-dump.html");

  // Also log all unique class names from the page for quick inspection
  const classes = await page.evaluate(() => {
    const all = new Set();
    document.querySelectorAll("[class]").forEach(el => {
      el.className.toString().split(/\s+/).forEach(c => c && all.add(c));
    });
    return [...all].sort();
  });
  console.log("\nAll classes on page:");
  classes.filter(c => /object|listing|item|card|thumb|property|kinnisvara/i.test(c)).forEach(c => console.log(" ", c));

  await browser.close();
})();
