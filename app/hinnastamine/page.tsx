import type { Metadata } from "next";
import { getPageData } from "../_lib/getPageData";
import PageContent from "../_components/PageContent";
import AutoOpenHinnastamine from "../_components/AutoOpenHinnastamine";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tasuta kinnisvara hinnastamine",
  description:
    "Taotle tasuta kinnisvara hinnastamist Kevin Kristofer Laanmetsalt. Täida vorm ning saad personaalse hinnapakkumise oma korterile, majale või kinnistule.",
  alternates: { canonical: "/hinnastamine" },
};

export default async function HinnastaminePage() {
  const data = await getPageData();
  return (
    <>
      <PageContent data={data} />
      <AutoOpenHinnastamine />
    </>
  );
}
