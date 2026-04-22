import {
  fetchHero,
  fetchServices,
  fetchTestimonials,
  fetchSalesProcess,
  fetchReels,
  fetchContact,
} from "@/sanity/lib/queries";
import PageContent from "./_components/PageContent";

export const revalidate = 60;

export default async function Page() {
  const [hero, services, testimonials, salesProcess, reels, contact] =
    await Promise.all([
      fetchHero(),
      fetchServices(),
      fetchTestimonials(),
      fetchSalesProcess(),
      fetchReels(),
      fetchContact(),
    ]);

  return (
    <PageContent
      data={{ hero, services, testimonials, salesProcess, reels, contact }}
    />
  );
}
