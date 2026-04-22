import { createClient } from "@sanity/client";
import { createReadStream, statSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, "../public");

const client = createClient({
  projectId: "djktjdvq",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN,
});

const videos = [
  "vid-1.mp4", "vid-2.mp4", "vid-3.mp4", "vid-4.mp4",
  "vid-5.mp4", "vid-6.mp4", "vid-7.mp4", "vid-8.mp4",
  "vid-9.mp4", "vid-10.mp4", "vid-11.mp4", "vid-12.mp4",
];

console.log("Uploading videos to Sanity...\n");

const videoItems = [];

for (const filename of videos) {
  const filePath = resolve(publicDir, "reels", filename);
  const { size } = statSync(filePath);
  const sizeMB = (size / 1024 / 1024).toFixed(1);

  process.stdout.write(`  Uploading ${filename} (${sizeMB} MB)...`);

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

    console.log(` ✓ (${asset._id})`);
  } catch (err) {
    console.log(` ✗ ${err.message}`);
  }
}

if (videoItems.length === 0) {
  console.log("\nNo videos uploaded, aborting.");
  process.exit(1);
}

console.log(`\nSaving reels document with ${videoItems.length} videos...`);

try {
  await client.createOrReplace({
    _id: "reels",
    _type: "reels",
    videos: videoItems,
  });
  console.log("✓ reels document saved and published!\n");
} catch (err) {
  console.error("✗ Failed to save reels document:", err.message);
}
