import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { mediaPlugin } from "sanity-plugin-media";
import { schemaTypes } from "./sanity/schemas";

const singletons = ["hero", "services", "testimonials", "salesProcess", "reels", "contact"];

export default defineConfig({
  name: "kevin-laanmets",
  title: "Kevin Laanmets — Sisu haldus",
  projectId: "djktjdvq",
  dataset: "production",
  plugins: [
    mediaPlugin(),
    structureTool({
      structure: (S) =>
        S.list()
          .title("Sektsioonid")
          .items([
            S.listItem().title("Hero sektsioon").id("hero")
              .child(S.document().schemaType("hero").documentId("hero")),
            S.listItem().title("Teenused").id("services")
              .child(S.document().schemaType("services").documentId("services")),
            S.listItem().title("Reelid (videod)").id("reels")
              .child(S.document().schemaType("reels").documentId("reels")),
            S.listItem().title("Klientide tagasiside").id("testimonials")
              .child(S.document().schemaType("testimonials").documentId("testimonials")),
            S.listItem().title("Müügiprotsess").id("salesProcess")
              .child(S.document().schemaType("salesProcess").documentId("salesProcess")),
            S.listItem().title("Kontakt").id("contact")
              .child(S.document().schemaType("contact").documentId("contact")),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletons.includes(schemaType)),
  },
});
