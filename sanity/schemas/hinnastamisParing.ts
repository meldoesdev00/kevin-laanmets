import { defineField, defineType } from "sanity";

export default defineType({
  name: "hinnastamisParing",
  title: "Hinnastamise päring",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nimi", type: "string" }),
    defineField({ name: "phone", title: "Telefon", type: "string" }),
    defineField({ name: "email", title: "E-mail", type: "string" }),
    defineField({
      name: "propertyType",
      title: "Vara tüüp",
      type: "string",
      options: { list: ["Korter", "Maja", "Ridaelamu", "Suvila", "Maatükk"] },
    }),
    defineField({ name: "rooms", title: "Tubade arv", type: "string" }),
    defineField({ name: "address", title: "Aadress", type: "string" }),
    defineField({
      name: "planToSell",
      title: "Plaanib müüa 3 kuu jooksul",
      type: "string",
      options: { list: ["Jah", "Ei"] },
    }),
    defineField({ name: "utmSource", title: "UTM allikas (utm_source)", type: "string" }),
    defineField({ name: "utmMedium", title: "UTM meedium (utm_medium)", type: "string" }),
    defineField({ name: "utmCampaign", title: "UTM kampaania (utm_campaign)", type: "string" }),
    defineField({ name: "submittedAt", title: "Esitamise aeg", type: "datetime" }),
  ],
  orderings: [
    {
      title: "Uuemad esimesena",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "name", planToSell: "planToSell", propertyType: "propertyType" },
    prepare: ({ title, planToSell, propertyType }) => ({
      title,
      subtitle: `${planToSell ?? "?"} — ${propertyType ?? ""}`,
    }),
  },
});
