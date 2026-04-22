import { defineField, defineType } from "sanity";

export default defineType({
  name: "testimonials",
  title: "Klientide tagasiside",
  type: "document",
  fields: [
    defineField({
      name: "items",
      title: "Arvustused",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "name", title: "Nimi", type: "string" }),
            defineField({ name: "role", title: "Roll (nt Kodu ostja)", type: "string" }),
            defineField({ name: "text", title: "Arvustus", type: "text", rows: 4 }),
          ],
          preview: { select: { title: "name", subtitle: "role" } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Klientide tagasiside" }) },
});
