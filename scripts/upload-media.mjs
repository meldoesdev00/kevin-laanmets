import { createClient } from "@sanity/client";
import { createReadStream, statSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, "../public");

const client = createClient({
  projectId: "djktjdvq",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

if (!process.env.SANITY_WRITE_TOKEN) {
  console.error("❌  SANITY_WRITE_TOKEN puudub!\n   Käivita: SANITY_WRITE_TOKEN=<token> node scripts/upload-media.mjs");
  process.exit(1);
}

/* ── 1. Profiilipilt ─────────────────────────────────── */

console.log("\n📸  Laen profiilipildi üles...");

const photoPath = resolve(publicDir, "laanmets.jpg");
if (!existsSync(photoPath)) {
  console.log("   ⚠️  laanmets.jpg ei leitud, jätan vahele.");
} else {
  const { size } = statSync(photoPath);
  process.stdout.write(`   laanmets.jpg (${(size / 1024).toFixed(0)} KB)...`);
  try {
    const imageAsset = await client.assets.upload("image", createReadStream(photoPath), {
      filename: "laanmets.jpg",
      contentType: "image/jpeg",
    });
    console.log(` ✓`);

    // Pata hero dokument
    await client
      .patch("hero")
      .set({
        photo: {
          _type: "image",
          asset: { _type: "reference", _ref: imageAsset._id },
        },
      })
      .commit();
    console.log("   ✓ Hero dokument uuendatud pildiga");
  } catch (err) {
    console.log(` ✗ ${err.message}`);
  }
}

/* ── 2. Reelid (videod) ──────────────────────────────── */

console.log("\n🎬  Laen videod üles...");

const videoFiles = [
  "vid-1.mp4","vid-2.mp4","vid-3.mp4","vid-4.mp4",
  "vid-5.mp4","vid-6.mp4","vid-7.mp4","vid-8.mp4",
  "vid-9.mp4","vid-10.mp4","vid-11.mp4","vid-12.mp4",
];

const videoItems = [];

for (const filename of videoFiles) {
  const filePath = resolve(publicDir, "reels", filename);
  if (!existsSync(filePath)) {
    console.log(`   ⚠️  ${filename} ei leitud, jätan vahele.`);
    continue;
  }
  const { size } = statSync(filePath);
  process.stdout.write(`   ${filename} (${(size / 1024 / 1024).toFixed(1)} MB)...`);
  try {
    const asset = await client.assets.upload("file", createReadStream(filePath), {
      filename,
      contentType: "video/mp4",
    });
    videoItems.push({
      _key: filename.replace(".mp4", ""),
      _type: "object",
      video: {
        _type: "file",
        asset: { _type: "reference", _ref: asset._id },
      },
    });
    console.log(` ✓`);
  } catch (err) {
    console.log(` ✗ ${err.message}`);
  }
}

if (videoItems.length > 0) {
  process.stdout.write(`\n   Salvestan reelid dokumenti (${videoItems.length} videot)...`);
  try {
    await client.createOrReplace({
      _id: "reels",
      _type: "reels",
      videos: videoItems,
    });
    console.log(" ✓");
  } catch (err) {
    console.log(` ✗ ${err.message}`);
  }
}

console.log("\n✅  Kõik valmis! Ava /studio → Media et näha üleslaetud faile.\n");
