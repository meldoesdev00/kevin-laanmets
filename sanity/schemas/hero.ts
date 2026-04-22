import { defineField, defineType } from "sanity";

export default defineType({
  name: "hero",
  title: "Hero sektsioon",
  type: "document",
  fields: [
    defineField({ name: "headline", title: "Pealkiri", type: "string" }),
    defineField({ name: "subtext", title: "Kirjeldus", type: "text", rows: 3 }),
    defineField({
      name: "primaryButton",
      title: "Nupp 1 (roheline täidetud)",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Tekst", type: "string" }),
        defineField({ name: "href", title: "Link", type: "string" }),
      ],
    }),
    defineField({
      name: "secondaryButton",
      title: "Nupp 2 (roheline äärisega)",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Tekst", type: "string" }),
        defineField({ name: "href", title: "Link", type: "string" }),
      ],
    }),
    defineField({
      name: "photo",
      title: "Profiilipilt",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "instagramUrl", title: "Instagram link", type: "url" }),
    defineField({ name: "facebookUrl", title: "Facebook link", type: "url" }),
    defineField({
      name: "statCards",
      title: "Statistika cardid",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "value", title: "Väärtus (nt 100+)", type: "string" }),
            defineField({ name: "label", title: "Silt (nt Klienti aidatud)", type: "string" }),
            defineField({
              name: "color",
              title: "Värv",
              type: "string",
              options: { list: [{ title: "Roheline (accent)", value: "accent" }, { title: "Must (dark)", value: "dark" }] },
            }),
            defineField({
              name: "position",
              title: "Asukoht pildil",
              type: "string",
              options: {
                list: [
                  { title: "Vasak ülemine", value: "top-left" },
                  { title: "Vasak keskmine", value: "mid-left" },
                  { title: "Parem ülemine", value: "top-right" },
                  { title: "Parem alumine", value: "bottom-right" },
                ],
              },
            }),
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Hero sektsioon" }) },
});
