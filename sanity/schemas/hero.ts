import { defineField, defineType } from "sanity";

const BUTTON_COLORS = [
  { title: "Roheline täidetud", value: "accent" },
  { title: "Must täidetud", value: "dark" },
  { title: "Roheline äärisega", value: "accent-outline" },
  { title: "Must äärisega", value: "dark-outline" },
];

const LINK_TARGETS = [
  { title: "Kontakt sektsioon", value: "#contact" },
  { title: "Teenused sektsioon", value: "#services" },
  { title: "KV.EE portfell", value: "https://www.kv.ee/broker/kevinkristoferlaanmets" },
  { title: "Instagram", value: "https://www.instagram.com/kevin.laanmets" },
  { title: "Facebook", value: "https://www.facebook.com/kevin.laanmets" },
];

export default defineType({
  name: "hero",
  title: "Hero sektsioon",
  type: "document",
  fields: [
    defineField({ name: "headline", title: "Pealkiri", type: "string" }),
    defineField({ name: "subtext", title: "Kirjeldus", type: "text", rows: 3 }),
    defineField({
      name: "primaryButton",
      title: "Nupp 1",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Tekst", type: "string" }),
        defineField({
          name: "href",
          title: "Link (kuhu viib)",
          type: "string",
          options: { list: LINK_TARGETS },
        }),
        defineField({
          name: "color",
          title: "Värv",
          type: "string",
          initialValue: "accent",
          options: { list: BUTTON_COLORS },
        }),
      ],
    }),
    defineField({
      name: "secondaryButton",
      title: "Nupp 2",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Tekst", type: "string" }),
        defineField({
          name: "href",
          title: "Link (kuhu viib)",
          type: "string",
          options: { list: LINK_TARGETS },
        }),
        defineField({
          name: "color",
          title: "Värv",
          type: "string",
          initialValue: "accent-outline",
          options: { list: BUTTON_COLORS },
        }),
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
      title: "Statistika cardid (pildil)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "value", title: "Väärtus (nt 100+)", type: "string" }),
            defineField({ name: "label", title: "Silt (nt Klienti aidatud)", type: "string" }),
            defineField({
              name: "color",
              title: "Numbri värv",
              type: "string",
              options: {
                list: [
                  { title: "Roheline", value: "accent" },
                  { title: "Must", value: "dark" },
                ],
              },
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
          preview: { select: { title: "value", subtitle: "label" } },
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Hero sektsioon" }) },
});
