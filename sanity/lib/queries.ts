import { client } from "./client";

// ── Queries ────────────────────────────────────────────────

const heroQuery = `*[_type == "hero" && _id == "hero"][0]{
  headline, subtext,
  primaryButton{ label, href, color },
  secondaryButton{ label, href, color },
  photo{ asset->{ url } },
  instagramUrl, facebookUrl,
  statCards[]{ value, label, color, position }
}`;

const servicesQuery = `*[_type == "services" && _id == "services"][0]{
  sectionTitle, bullets, ctaLabel, ctaColor,
  cards[]{ _key, title, body, iconColor }
}`;

const testimonialsQuery = `*[_type == "testimonials" && _id == "testimonials"][0]{
  items[]{ _key, name, role, text }
}`;

const salesProcessQuery = `*[_type == "salesProcess" && _id == "salesProcess"][0]{
  steps[]{ _key, num, title, body }
}`;

const reelsQuery = `*[_type == "reels" && _id == "reels"][0]{
  videos[]{ _key, video{ asset->{ url } }, poster{ asset->{ url } } }
}`;

const contactQuery = `*[_type == "contact" && _id == "contact"][0]{
  phone, email, kvUrl, smsNumber, ctaHeadline, ctaSubtext
}`;

// ── Fetch functions ────────────────────────────────────────

export async function fetchHero() {
  return client.fetch(heroQuery);
}
export async function fetchServices() {
  return client.fetch(servicesQuery);
}
export async function fetchTestimonials() {
  return client.fetch(testimonialsQuery);
}
export async function fetchSalesProcess() {
  return client.fetch(salesProcessQuery);
}
export async function fetchReels() {
  return client.fetch(reelsQuery);
}
export async function fetchContact() {
  return client.fetch(contactQuery);
}
