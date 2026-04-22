import { defineField, defineType } from "sanity";

export default defineType({
  name: "services",
  title: "Teenused",
  type: "document",
  fields: [
    defineField({ name: "sectionTitle", title: "Sektsiooni pealkiri", type: "string" }),
    defineField({
      name: "bullets",
      title: "Punktid (vasakul)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({ name: "ctaLabel", title: "Nupp — tekst", type: "string" }),
    defineField({ name: "ctaHref", title: "Nupp — link", type: "string" }),
    defineField({
      name: "cards",
      title: "Teenuse kaardid",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Pealkiri", type: "string" }),
            defineField({ name: "body", title: "Kirjeldus", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Teenused" }) },
});
