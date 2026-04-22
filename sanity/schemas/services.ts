import { defineField, defineType } from "sanity";

const BUTTON_COLORS = [
  { title: "Roheline täidetud", value: "accent" },
  { title: "Must täidetud", value: "dark" },
  { title: "Roheline äärisega", value: "accent-outline" },
  { title: "Must äärisega", value: "dark-outline" },
];

const ICON_COLORS = [
  { title: "Roheline", value: "accent" },
  { title: "Must", value: "dark" },
];

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
    defineField({
      name: "ctaColor",
      title: "Nupp — värv",
      type: "string",
      initialValue: "accent",
      options: { list: BUTTON_COLORS },
    }),
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
            defineField({
              name: "iconColor",
              title: "Ikooni värv",
              type: "string",
              initialValue: "dark",
              options: { list: ICON_COLORS },
            }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Teenused" }) },
});
