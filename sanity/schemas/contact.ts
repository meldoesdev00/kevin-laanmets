import { defineField, defineType } from "sanity";

export default defineType({
  name: "contact",
  title: "Kontakt",
  type: "document",
  fields: [
    defineField({ name: "phone", title: "Telefon", type: "string" }),
    defineField({ name: "email", title: "E-post", type: "string" }),
    defineField({ name: "kvUrl", title: "KV.EE profiili link", type: "url" }),
    defineField({ name: "whatsappUrl", title: "WhatsApp link", type: "url" }),
    defineField({ name: "ctaHeadline", title: "Pealkiri (Kontakt sektsioon)", type: "string" }),
    defineField({ name: "ctaSubtext", title: "Kirjeldus (Kontakt sektsioon)", type: "text", rows: 2 }),
  ],
  preview: { prepare: () => ({ title: "Kontakt" }) },
});
