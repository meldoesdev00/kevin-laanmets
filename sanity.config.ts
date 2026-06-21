import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { media } from "sanity-plugin-media";
import { schemaTypes } from "./sanity/schemas";

const singletons = ["hero", "services", "testimonials", "salesProcess", "reels", "contact"];

export default defineConfig({
  name: "kevin-laanmets",
  title: "Kevin Laanmets — Sisu haldus",
  projectId: "djktjdvq",
  dataset: "production",
  plugins: [
    media(),
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
            S.divider(),
            S.listItem().title("Hinnastamise päringud").id("hinnastamisParingud")
              .child(
                S.list()
                  .title("Hinnastamise päringud")
                  .items([
                    S.listItem().title("Müügisoovijad (JAH)").id("hinnastamisJah")
                      .child(
                        S.documentTypeList("hinnastamisParing")
                          .title("Müügisoovijad (JAH)")
                          .filter('_type == "hinnastamisParing" && planToSell == "Jah"')
                          .defaultOrdering([{ field: "submittedAt", direction: "desc" }])
                      ),
                    S.listItem().title("Ei plaani praegu (EI)").id("hinnastamisEi")
                      .child(
                        S.documentTypeList("hinnastamisParing")
                          .title("Ei plaani praegu (EI)")
                          .filter('_type == "hinnastamisParing" && planToSell == "Ei"')
                          .defaultOrdering([{ field: "submittedAt", direction: "desc" }])
                      ),
                    S.listItem().title("Kõik päringud").id("hinnastamisKoik")
                      .child(
                        S.documentTypeList("hinnastamisParing")
                          .title("Kõik päringud")
                          .defaultOrdering([{ field: "submittedAt", direction: "desc" }])
                      ),
                  ])
              ),
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
