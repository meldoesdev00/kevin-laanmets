import { defineField, defineType } from "sanity";

export default defineType({
  name: "hinnastamiseKylastus",
  title: "Hinnastamise lehe külastus",
  type: "document",
  fields: [
    defineField({ name: "utmSource", title: "UTM allikas (utm_source)", type: "string" }),
    defineField({ name: "utmMedium", title: "UTM meedium (utm_medium)", type: "string" }),
    defineField({ name: "utmCampaign", title: "UTM kampaania (utm_campaign)", type: "string" }),
    defineField({ name: "visitedAt", title: "Külastuse aeg", type: "datetime" }),
  ],
  orderings: [
    {
      title: "Uuemad esimesena",
      name: "visitedAtDesc",
      by: [{ field: "visitedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "utmSource", subtitle: "visitedAt" },
    prepare: ({ title, subtitle }) => ({
      title: title ?? "(otsene/teadmata allikas)",
      subtitle,
    }),
  },
});
