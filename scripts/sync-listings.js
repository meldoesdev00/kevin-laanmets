/**
 * sync-listings.js
 *
 * Run from your local machine whenever your kv.ee listings change:
 *   npm run sync-listings
 *
 * Opens a real Chromium window, loads your kv.ee broker page,
 * extracts all active listings and writes them to data/listings.json.
 * Commit the updated file and redeploy to publish the changes.
 */

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BROKER_URL = "https://www.kv.ee/broker/kevinkristoferlaanmets";
const BASE_URL = "https://www.kv.ee";
const OUTPUT_PATH = path.join(__dirname, "../data/listings.json");

async function syncListings() {
  const isCI = process.env.CI === "true";
  console.log(`Launching browser… (headless: ${isCI})`);
  const browser = await chromium.launch({
    headless: isCI,
    slowMo: isCI ? 0 : 80,
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 900 },
    locale: "et-EE",
  });

  const page = await context.newPage();

  console.log(`Navigating to ${BROKER_URL}`);
  await page.goto(BROKER_URL, { waitUntil: "domcontentloaded", timeout: 60000 });

  // Wait for the listing articles to appear
  console.log("Waiting for listings…");
  try {
    await page.waitForSelector("article[data-object-id]", { timeout: 20000 });
  } catch {
    console.warn("Timed out waiting for article[data-object-id] — trying anyway.");
  }

  // Give lazy images and any JS hydration a moment
  await page.waitForTimeout(2000);

  // ── Extract listings ───────────────────────────────────────────────────────
  const listings = await page.evaluate((baseUrl) => {
    const results = [];

    document.querySelectorAll("article[data-object-id]").forEach((article) => {
      // ── URL ──────────────────────────────────────────────────────────────
      const relUrl = article.getAttribute("data-object-url") || "";
      const href = relUrl.startsWith("http") ? relUrl : baseUrl + relUrl;

      // ── First image — kv.ee lazy-loads, prefer data-src ──────────────────
      const firstImg = article.querySelector(".images img, .media img, img");
      const image =
        firstImg?.getAttribute("data-src") ||
        firstImg?.getAttribute("src") ||
        "";

      // Skip listings with no image
      if (!image || image.trim() === "") return;

      // ── Address / title ───────────────────────────────────────────────────
      // kv.ee puts the address inside h2 > a, e.g. "Harjumaa, Tallinn, Pirita, Viimsi tee 16a"
      const h2Link = article.querySelector("h2 a");
      const fullAddress = h2Link?.textContent?.trim() || "";

      // Split "County, City, District, Street address" → keep last two parts as the short name
      const parts = fullAddress.split(",").map((p) => p.trim()).filter(Boolean);
      const name = parts.slice(-2).join(", "); // e.g. "Pirita, Viimsi tee 16a"
      const address = parts.slice(0, -1).join(", "); // e.g. "Harjumaa, Tallinn, Pirita"

      // ── Price ─────────────────────────────────────────────────────────────
      const priceEl = article.querySelector(".price");
      // Strip the monthly-payment sub-element text
      const priceClone = priceEl?.cloneNode(true);
      priceClone?.querySelectorAll(".label, .monthly-price, small")?.forEach((el) => el.remove());
      const price = priceClone?.textContent?.trim().replace(/\s+/g, " ") || "";

      // ── Area ──────────────────────────────────────────────────────────────
      const areaEl = article.querySelector(".area");
      const area = areaEl?.textContent?.trim().replace(/\s+/g, " ") || "";

      results.push({ name, address, price, area, image, href });
    });

    return results;
  }, BASE_URL);

  await browser.close();

  if (listings.length === 0) {
    console.error(
      "\n❌  No listings found.\n" +
        "   Check that:\n" +
        "   1. You have active listings on kv.ee under this broker profile.\n" +
        "   2. The browser window showed the listings (no Cloudflare block).\n"
    );
    process.exit(1);
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(listings, null, 2));

  console.log(`\n✅  Saved ${listings.length} listing(s) → data/listings.json\n`);
  listings.forEach((l, i) =>
    console.log(`   ${i + 1}. ${l.name}  |  ${l.price}  |  ${l.href}`)
  );
  console.log("\nNext: git add data/listings.json && git commit -m 'sync listings' && git push\n");
}

syncListings().catch((err) => {
  console.error("Sync failed:", err.message);
  process.exit(1);
});
