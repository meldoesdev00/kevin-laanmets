import { defineField, defineType } from "sanity";

export default defineType({
  name: "reels",
  title: "Reelid (videod)",
  type: "document",
  fields: [
    defineField({
      name: "videos",
      title: "Videod",
      description: "Lae üles videod (MP4 formaat soovituslik). Järjekorda saab lohistades muuta.",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "video",
              title: "Video fail",
              type: "file",
              options: { accept: "video/*" },
            }),
            defineField({
              name: "poster",
              title: "Eelvaate pilt (valikuline)",
              type: "image",
              options: { hotspot: true },
            }),
          ],
          preview: { select: { title: "video.asset.originalFilename" } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Reelid (videod)" }) },
});
