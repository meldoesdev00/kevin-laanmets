import { defineField, defineType } from "sanity";

export default defineType({
  name: "salesProcess",
  title: "Müügiprotsess",
  type: "document",
  fields: [
    defineField({
      name: "steps",
      title: "Sammud",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "num", title: "Number (nt 01)", type: "string" }),
            defineField({ name: "title", title: "Pealkiri", type: "string" }),
            defineField({ name: "body", title: "Kirjeldus", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "num", subtitle: "title" } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Müügiprotsess" }) },
});
