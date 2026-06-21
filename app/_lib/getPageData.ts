import {
  fetchHero,
  fetchServices,
  fetchTestimonials,
  fetchSalesProcess,
  fetchReels,
  fetchContact,
} from "@/sanity/lib/queries";
import type { PageData } from "../_components/PageContent";

export async function getPageData(): Promise<PageData> {
  const [hero, services, testimonials, salesProcess, reels, contact] =
    await Promise.all([
      fetchHero(),
      fetchServices(),
      fetchTestimonials(),
      fetchSalesProcess(),
      fetchReels(),
      fetchContact(),
    ]);

  return { hero, services, testimonials, salesProcess, reels, contact };
}
