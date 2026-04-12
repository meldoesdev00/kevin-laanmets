/**
 * download-reels.js
 *
 * Instagram uses DASH streaming: video arrives as an init segment (ftyp+moov)
 * followed by many moof+mdat chunks. This script collects ALL of them in order
 * and concatenates them into a single playable MP4.
 *
 * Usage:  npm run download-reels
 */

const { chromium } = require("playwright");
const fs   = require("fs");
const path = require("path");

const PROFILE_URL = "https://www.instagram.com/kevin_k_laanmets/reels/";
const OUTPUT_DIR  = path.join(__dirname, "../public/reels");
const REELS_JSON  = path.join(__dirname, "../data/reels.json");
const MAX_REELS   = 8;
// How long to stay on each reel page (collect segments)
const SOAK_MS = 10_000;

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.readdirSync(OUTPUT_DIR)
  .filter(f => f.endsWith(".mp4"))
  .forEach(f => fs.unlinkSync(path.join(OUTPUT_DIR, f)));

function isVideoSegment(url, ct) {
  const videoMime = ct && (ct.startsWith("video/") || ct.includes("mp4"));
  const videoCdn  =
    (url.includes("cdninstagram") || url.includes("fbcdn.net")) &&
    (url.includes(".mp4") || url.includes("video") || url.includes("dash")) &&
    !url.includes(".jpg") && !url.includes(".png");
  return videoMime || videoCdn;
}

async function captureReelSegments(context, reelUrl) {
  const segments = []; // { seq, buf }

  const page = await context.newPage();

  // Collect every video response body in arrival order
  const promises = [];
  let seq = 0;
  page.on("response", response => {
    const url = response.url();
    const ct  = response.headers()["content-type"] || "";
    if (!isVideoSegment(url, ct)) return;
    const mySeq = seq++;
    const p = response.body()
      .then(buf => { if (buf && buf.length > 100) segments.push({ seq: mySeq, buf }); })
      .catch(() => {});
    promises.push(p);
  });

  try {
    await page.goto(reelUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
    // Trigger autoplay
    await page.waitForTimeout(1500);
    await page.evaluate(() => {
      document.querySelectorAll("video").forEach(v => {
        v.muted = true;
        v.play().catch(() => {});
      });
    });
    // Let enough segments arrive
    await page.waitForTimeout(SOAK_MS);
  } catch { /* continue */ }

  await Promise.all(promises);
  await page.close();

  if (!segments.length) return null;

  // Sort by arrival order, then concatenate
  segments.sort((a, b) => a.seq - b.seq);
  return Buffer.concat(segments.map(s => s.buf));
}

async function run() {
  console.log("Launching browser…");
  const browser = await chromium.launch({ headless: false, slowMo: 30 });
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    viewport: { width: 390, height: 844 }, // mobile viewport = larger video
  });

  // ── Get reel list ────────────────────────────────────────────────────────
  const listPage = await context.newPage();
  console.log(`\nNavigating to ${PROFILE_URL}`);
  await listPage.goto(PROFILE_URL, { waitUntil: "domcontentloaded", timeout: 60000 });

  console.log("\n→ Log in to Instagram if prompted, then wait for the reels grid.\n");
  try {
    await listPage.waitForSelector("a[href*='/reel/']", { timeout: 90000 });
    console.log("Reels grid detected!");
  } catch { console.warn("Proceeding anyway…"); }
  await listPage.waitForTimeout(1500);

  const reelLinks = await listPage.$$eval("a[href*='/reel/']", els => {
    const seen = new Set();
    return els.map(a => a.href.split("?")[0]).filter(h => {
      if (seen.has(h)) return false; seen.add(h); return true;
    });
  });
  console.log(`Found ${reelLinks.length} reel link(s).\n`);
  await listPage.close();

  if (!reelLinks.length) {
    await browser.close();
    console.error("❌  No reel links found.");
    process.exit(1);
  }

  // ── Download each reel ───────────────────────────────────────────────────
  const saved = [];
  for (let i = 0; i < Math.min(reelLinks.length, MAX_REELS); i++) {
    const reelUrl = reelLinks[i];
    console.log(`[${i+1}/${Math.min(reelLinks.length, MAX_REELS)}] ${reelUrl}`);

    const buf = await captureReelSegments(context, reelUrl);
    if (!buf || buf.length < 200_000) {
      console.log(`  ✗  Insufficient data (${buf?.length ?? 0} bytes), skipping.\n`);
      continue;
    }

    const filename = `reel-${String(i+1).padStart(2,"0")}.mp4`;
    const dest     = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(dest, buf);

    // Quick sanity: try remux with ffmpeg if available
    try {
      const { execSync } = require("child_process");
      const tmp = dest.replace(".mp4", "-remux.mp4");
      execSync(`ffmpeg -i "${dest}" -c copy -movflags faststart "${tmp}" -y 2>/dev/null`, { stdio: "pipe" });
      if (fs.existsSync(tmp) && fs.statSync(tmp).size > 100_000) {
        fs.renameSync(tmp, dest);
        console.log(`  ✓  ${filename} remuxed (${(fs.statSync(dest).size/1024/1024).toFixed(1)} MB)\n`);
      } else {
        if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
        console.log(`  ✓  ${filename} (${(buf.length/1024/1024).toFixed(1)} MB — raw segments)\n`);
      }
    } catch {
      console.log(`  ✓  ${filename} (${(buf.length/1024/1024).toFixed(1)} MB)\n`);
    }

    saved.push({ src: `/reels/${filename}`, poster: null });
  }

  await browser.close();

  if (!saved.length) {
    console.error("❌  No reels saved.\n");
    process.exit(1);
  }

  fs.writeFileSync(REELS_JSON, JSON.stringify(saved, null, 2));
  console.log(`✅  Saved ${saved.length} reel(s) → data/reels.json\n`);
}

run().catch(err => {
  console.error("Failed:", err.message);
  process.exit(1);
});
