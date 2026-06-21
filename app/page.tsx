import { getPageData } from "./_lib/getPageData";
import PageContent from "./_components/PageContent";

export const revalidate = 60;

export default async function Page() {
  const data = await getPageData();
  return <PageContent data={data} />;
}
