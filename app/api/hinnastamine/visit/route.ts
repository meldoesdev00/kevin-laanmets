import { writeClient } from "@/sanity/lib/client";

type Body = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

export async function POST(request: Request) {
  const { utmSource, utmMedium, utmCampaign }: Body = await request.json();

  try {
    await writeClient.create({
      _type: "hinnastamiseKylastus",
      utmSource,
      utmMedium,
      utmCampaign,
      visitedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to save hinnastamiseKylastus to Sanity:", err);
  }

  return Response.json({ ok: true });
}
