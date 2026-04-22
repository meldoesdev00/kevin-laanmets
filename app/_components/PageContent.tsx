"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import listingsData from "../../data/listings.json";

/* ─── TYPES ──────────────────────────────────────────────── */

type SanityImageUrl = { asset: { url: string } } | null;

export type SanityHero = {
  headline?: string;
  subtext?: string;
  primaryButton?: { label?: string; href?: string; color?: string };
  secondaryButton?: { label?: string; href?: string; color?: string };
  photo?: SanityImageUrl;
  instagramUrl?: string;
  facebookUrl?: string;
  statCards?: Array<{ value?: string; label?: string; color?: string; position?: string }>;
} | null;

export type SanityServices = {
  sectionTitle?: string;
  bullets?: string[];
  ctaLabel?: string;
  ctaColor?: string;
  cards?: Array<{ _key?: string; title?: string; body?: string; iconColor?: string }>;
} | null;

export type SanityTestimonials = {
  items?: Array<{ _key?: string; name?: string; role?: string; text?: string }>;
} | null;

export type SanitySalesProcess = {
  steps?: Array<{ _key?: string; num?: string; title?: string; body?: string }>;
} | null;

export type SanityReels = {
  videos?: Array<{ _key?: string; video?: { asset?: { url?: string } }; poster?: SanityImageUrl }>;
} | null;

export type SanityContact = {
  phone?: string;
  email?: string;
  kvUrl?: string;
  smsNumber?: string;
  ctaHeadline?: string;
  ctaSubtext?: string;
} | null;

export type PageData = {
  hero: SanityHero;
  services: SanityServices;
  testimonials: SanityTestimonials;
  salesProcess: SanitySalesProcess;
  reels: SanityReels;
  contact: SanityContact;
};

/* ─── BUTTON COLOR HELPER ────────────────────────────────── */

function btnClass(color: string | undefined, fallback: string): string {
  switch (color) {
    case "accent":         return "bg-accent text-white hover:opacity-90";
    case "dark":           return "bg-[#161616] text-white hover:opacity-90";
    case "accent-outline": return "border border-accent text-accent hover:bg-accent/10";
    case "dark-outline":   return "border border-[#161616] text-[#161616] hover:bg-black/5";
    default:               return fallback;
  }
}

/* ─── FALLBACK DATA ──────────────────────────────────────── */

const DEFAULT_SERVICES = [
  {
    title: "Kinnisvara müük",
    body: "Aitan müüa kortereid ja maju läbimõeldult ja selge strateegiaga. Alustan turuanalüüsist ja hinnastamisest ning juhin kogu müügiprotsessi algusest kuni tehinguni.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" style={{ width: "100%", height: "100%", fill: "currentColor" }}>
        <path d="M143.38,17.85a8,8,0,0,0-12.63,3.41l-22,60.41L84.59,58.26a8,8,0,0,0-11.93.89C51,87.53,40,116.08,40,144a88,88,0,0,0,176,0C216,84.55,165.21,36,143.38,17.85ZM128,216a72.08,72.08,0,0,1-72-72c0-22,8.09-44.79,24.06-67.84l26.37,25.58a8,8,0,0,0,13.09-3l22.27-61.07C164.21,58.08,200,97.91,200,144A72.08,72.08,0,0,1,128,216Z" />
      </svg>
    ),
  },
  {
    title: "Kinnisvara ost",
    body: "Toetan oma kliente oluliste otsuste ja läbirääkimiste juures. Aitan hinnata riske, hoida selget pilti ning jõuda eduka tehinguni.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" style={{ width: "100%", height: "100%", fill: "currentColor" }}>
        <path d="M224,48H32A16,16,0,0,0,16,64V88a16,16,0,0,0,16,16v88a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V104a16,16,0,0,0,16-16V64A16,16,0,0,0,224,48ZM208,192H48V104H208ZM224,88H32V64H224V88ZM96,136a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,136Z" />
      </svg>
    ),
  },
  {
    title: "Kinnisvara üürimine",
    body: "Aitan kinnisvara üürileandmisel leida Sulle sobiva üürniku. Juhin kogu protsessi nii, et see oleks korrektne, selge ja ajaliselt tõhus.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" style={{ width: "100%", height: "100%", fill: "currentColor" }}>
        <path d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Zm-68-56a12,12,0,1,1-12-12A12,12,0,0,1,140,152Z" />
      </svg>
    ),
  },
  {
    title: "Koostöö partneritega",
    body: "Teen koostööd usaldusväärsete koostööpartneritega alates pankadest kuni sisekujundajateni, et tagada tehingu sujuv kulg.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" style={{ width: "100%", height: "100%", fill: "currentColor" }}>
        <path d="M27.2,126.4a8,8,0,0,0,11.2-1.6,52,52,0,0,1,83.2,0,8,8,0,0,0,11.2,1.59,7.73,7.73,0,0,0,1.59-1.59h0a52,52,0,0,1,83.2,0,8,8,0,0,0,12.8-9.61A67.85,67.85,0,0,0,203,93.51a40,40,0,1,0-53.94,0,67.27,67.27,0,0,0-21,14.31,67.27,67.27,0,0,0-21-14.31,40,40,0,1,0-53.94,0A67.88,67.88,0,0,0,25.6,115.2,8,8,0,0,0,27.2,126.4ZM176,40a24,24,0,1,1-24,24A24,24,0,0,1,176,40ZM80,40A24,24,0,1,1,56,64,24,24,0,0,1,80,40ZM203,197.51a40,40,0,1,0-53.94,0,67.27,67.27,0,0,0-21,14.31,67.27,67.27,0,0,0-21-14.31,40,40,0,1,0-53.94,0A67.88,67.88,0,0,0,25.6,219.2a8,8,0,1,0,12.8,9.6,52,52,0,0,1,83.2,0,8,8,0,0,0,11.2,1.59,7.73,7.73,0,0,0,1.59-1.59h0a52,52,0,0,1,83.2,0,8,8,0,0,0,12.8-9.61A67.85,67.85,0,0,0,203,197.51ZM80,144a24,24,0,1,1-24,24A24,24,0,0,1,80,144Zm96,0a24,24,0,1,1-24,24A24,24,0,0,1,176,144Z" />
      </svg>
    ),
  },
];

const DEFAULT_TESTIMONIALS = [
  { name: "Ants K.", role: "Kodu ostja", text: "Kevini abiga leidsime unistuste kodu kolme nädalaga. Ta oli professionaalne, vastutulelev ja mõistis täpselt, mida otsisime. Soovitan soojalt!" },
  { name: "Maris L.", role: "Kodu müüja", text: "Kevin müüs meie korteri oodatust kõrgema hinnaga. Tema turuanalüüs ja müügistrateegia olid täppi lastud. Ei saaks tulemusega rohkem rahul olla." },
  { name: "Liis T.", role: "Esmakordne ostja", text: "Kevin selgitas iga sammu kannatlikult ja põhjalikult — tundsin end kogu protsessi vältel kindlalt. Väga soovitatav maakler esmakordsele ostjale." },
  { name: "Jaan M.", role: "Kinnisvarainvestor", text: "Kevini teenindus oli algusest lõpuni suurepärane. Suhtlus oli selge ja kiire — tundsime, et oleme täiesti usaldusväärsetes kätes." },
  { name: "Kadri L.", role: "Üürnik", text: "Kevin leidis meile täiusliku üürikorteri, mis vastas kõigile meie kriteeriumidele. Sujuv protsess, suurepärane tähelepanu detailidele ja päriselt isiklik lähenemine." },
];

const DEFAULT_STEPS = [
  { num: "01", title: "Tutvumine ja eesmärkide kaardistamine", body: "Tulen kohale, vaatan objekti üle ning räägime läbi sinu eesmärgid, ajaraami ja ootused." },
  { num: "02", title: "Turuanalüüs ja hinnastamine", body: "Analüüsin turgu, võrdlen sarnaseid tehinguid ning koostan strateegilise hinnastamise." },
  { num: "03", title: "Ettevalmistus ja professionaalne esitlus", body: "Koostame müügimaterjalid, korraldame professionaalse pildistamise või filmimise ning valmistame objekti ette nii, et see kõnetaks õigeid ostjaid." },
  { num: "04", title: "Aktiivne turundus ja müük", body: "Objekt jõuab sihitud kanalitesse. Juhin näitamisi, suhtlen ostuhuvilistega ning hoian kogu protsessi vältel sind kursis." },
  { num: "05", title: "Läbirääkimised ja edukas tehing", body: "Esindan sinu huve läbirääkimistel, koordineerin notariga, teen ostueelse kontrollin ning viin tehingu lõpuni." },
];

const LISTINGS = listingsData as { name: string; address: string; price?: string; image: string; href: string }[];

/* ─── HOOKS ──────────────────────────────────────────────── */

function useFadeIn(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── HERO ───────────────────────────────────────────────── */

function Hero({ hero }: { hero: SanityHero }) {
  const photoUrl = hero?.photo?.asset?.url ?? null;
  const headline = hero?.headline;
  const subtext = hero?.subtext;
  const primaryBtn = hero?.primaryButton;
  const secondaryBtn = hero?.secondaryButton;
  const igUrl = hero?.instagramUrl ?? "https://www.instagram.com/kevin.laanmets";
  const fbUrl = hero?.facebookUrl ?? "https://www.facebook.com/kevin.laanmets";

  // Map stat cards from Sanity or use hardcoded
  const statCards = hero?.statCards?.length
    ? hero.statCards
    : [
        { value: "100+", label: "Klienti aidatud", color: "dark", position: "top-left" },
        { value: "~68p", label: "Keskmine tehinguaeg", color: "accent", position: "mid-left" },
        { value: "TOP 1", label: "Kodumaa käive 2025", color: "dark", position: "top-right" },
        { value: "5+", label: "Aastat müügikogemust", color: "accent", position: "bottom-right" },
      ];

  const positionClass: Record<string, string> = {
    "top-left": "absolute -left-5 top-10",
    "mid-left": "absolute -left-5 top-[45%]",
    "top-right": "absolute -right-5 top-20",
    "bottom-right": "absolute -right-5 bottom-20",
  };

  return (
    <section className="bg-white min-h-screen flex flex-col">

      {/* ── Logo rida — navbar-positsioon, ainult desktop ── */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 w-full pt-14 pb-0" style={{ opacity: 0, animation: "fadeUp .5s .05s ease forwards" }}>
        <Image
          src="/kevin_logo.png"
          alt="Kevin Laanmets"
          width={270}
          height={84}
          className="h-[60px] w-auto object-contain"
        />
      </div>

      {/* ── Põhisisu ── */}
      <div className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full py-10 md:py-14">
          <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 lg:gap-20 lg:items-center">

            {/* ── Tekst ── */}
            <div className="flex flex-col">
              <h1
                className="font-display font-bold text-dark leading-[0.93] mb-6 md:mb-8"
                style={{ fontSize: "clamp(2.6rem, 6.5vw, 5.5rem)", letterSpacing: "-0.03em", opacity: 0, animation: "fadeUp .65s .2s ease forwards" }}
              >
                {headline ? (
                  <span>{headline}</span>
                ) : (
                  <>
                    <span className="lg:hidden">Müü või üüri<br />oma kinnisvara</span>
                    <span className="hidden lg:inline">Müü või<br />üüri oma<br />kinnisvara</span>
                  </>
                )}
              </h1>

              <p
                className="text-muted leading-[1.85] text-[0.95rem] mb-8 md:mb-10 max-w-[360px]"
                style={{ opacity: 0, animation: "fadeUp .65s .35s ease forwards" }}
              >
                {subtext ?? "Aitan nii ostjaid kui müüjaid kogu protsessi vältel alates esimesest konsultatsioonist kuni eduka tehingu lõpule viimiseni."}
              </p>

              <div
                className="flex flex-wrap gap-3"
                style={{ opacity: 0, animation: "fadeUp .65s .45s ease forwards" }}
              >
                <a
                  href={primaryBtn?.href ?? "https://www.kv.ee/broker/kevinkristoferlaanmets"}
                  target={primaryBtn?.href?.startsWith("http") ? "_blank" : undefined}
                  rel={primaryBtn?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                  className={`inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-[0.7rem] font-semibold tracking-[0.14em] uppercase transition-all duration-300 ${btnClass(primaryBtn?.color, "bg-accent text-white hover:opacity-90")}`}
                >
                  {primaryBtn?.label ?? "Minu portfell"}
                  <svg className="w-3.5 h-3.5 -rotate-45" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
                <button
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  className={`inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-[0.7rem] font-semibold tracking-[0.14em] uppercase transition-all duration-300 ${btnClass(secondaryBtn?.color, "border border-accent text-accent hover:bg-accent/10")}`}
                >
                  {secondaryBtn?.label ?? "Broneeri tasuta konsultatsioon"}
                </button>
              </div>

              {/* Sotsiaalid */}
              <div className="mt-8 flex items-center gap-3" style={{ opacity: 0, animation: "fadeUp .65s .55s ease forwards" }}>
                <a href={igUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center text-dark/50 hover:text-dark hover:border-black/30 transition-all duration-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a href={fbUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center text-dark/50 hover:text-dark hover:border-black/30 transition-all duration-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <div className="h-5 w-px bg-black/10 mx-1" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://cdn.prod.website-files.com/6942937ef5e1b2e432918a2f/6943bca40732694841061d80_logo.svg"
                  alt="Kodumaa"
                  className="h-8 opacity-40 hover:opacity-70 transition-opacity duration-200"
                />
              </div>
            </div>

            {/* ── Photo ── */}
            <div
              className="relative -mt-10"
              style={{ opacity: 0, animation: "fadeUp .7s .3s ease forwards" }}
            >
              <div className="relative rounded-3xl overflow-visible bg-stone-100 aspect-[4/5] md:aspect-[4/5] max-w-[480px] ml-auto">
                <div className="absolute inset-0 rounded-3xl overflow-hidden border border-stone-200">
                  <Image
                    src={photoUrl ?? "/laanmets.jpg"}
                    alt="Kevin Laanmets"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 90vw, 44vw"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-stone-100/60 to-transparent" />
                </div>

                {/* Stat cards */}
                {statCards.map((card, i) => (
                  <div
                    key={i}
                    className={`${positionClass[card.position ?? ""] ?? "absolute -left-5 top-10"} bg-white rounded-2xl shadow-lg shadow-stone-200/80 px-4 py-3 border border-stone-100 z-10`}
                  >
                    <div className={`text-xl font-extrabold leading-none ${card.color === "accent" ? "text-accent" : "text-[#161616]"}`}>
                      {card.value}
                    </div>
                    <div className="text-xs text-stone-500 font-medium mt-1">{card.label}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>{/* /grid */}
        </div>{/* /max-w-7xl */}
      </div>{/* /flex-1 */}
    </section>
  );
}

/* ─── VIDEO MODAL ────────────────────────────────────────── */

function VideoModal({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/30 transition-colors duration-200 z-10"
        aria-label="Sulge"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ height: "min(90vh, 680px)", aspectRatio: "9/16" }}
        onClick={e => e.stopPropagation()}
      >
        <video src={src} autoPlay controls playsInline className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

/* ─── REELS STRIP ────────────────────────────────────────── */

function ReelThumb({ src, onClick }: { src: string; onClick: () => void }) {
  return (
    <div className="relative group cursor-pointer" onClick={onClick}>
      <video src={src} autoPlay muted loop playsInline className="w-full h-full object-cover" />
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors duration-200">
        <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
          <svg className="w-4 h-4 text-stone-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ReelsStrip({ reels }: { reels: SanityReels }) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Build reel list: prefer Sanity videos, fall back to nothing (empty)
  const reelList: { src: string }[] = reels?.videos
    ?.filter(v => v.video?.asset?.url)
    .map(v => ({ src: v.video!.asset!.url! })) ?? [];

  const marqueeReels = [...reelList, ...reelList];
  const mobileReels = reelList.slice(0, 6);

  if (reelList.length === 0) return null;

  return (
    <>
      {activeVideo && <VideoModal src={activeVideo} onClose={() => setActiveVideo(null)} />}

      <section className="bg-stone-50 border-y border-stone-200 py-14 md:py-20 overflow-hidden">
        {/* Desktop: auto-scroll marquee */}
        <div className="hidden md:block">
          <div className="max-w-7xl mx-auto px-6 overflow-hidden">
            <div className="flex gap-4 animate-scroll-left" style={{ width: "max-content" }}>
              {marqueeReels.map((r, i) => (
                <div key={i} className="shrink-0 w-[200px] rounded-3xl overflow-hidden bg-stone-900" style={{ aspectRatio: "9/16" }}>
                  <ReelThumb src={r.src} onClick={() => setActiveVideo(r.src)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: 3-column grid */}
        <div className="md:hidden grid grid-cols-3 gap-3 px-6">
          {mobileReels.map((r, i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-stone-900" style={{ aspectRatio: "9/16" }}>
              <ReelThumb src={r.src} onClick={() => setActiveVideo(r.src)} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

/* ─── SERVICES ───────────────────────────────────────────── */

function Services({ services }: { services: SanityServices }) {
  const { ref, visible } = useFadeIn(0.08);

  const sectionTitle = services?.sectionTitle ?? "Pakutavad teenused";
  const ctaLabel = services?.ctaLabel ?? "Broneeri konsultatsioon";
  const ctaColor = services?.ctaColor;
  const bullets = services?.bullets?.length
    ? services.bullets
    : [
        "Tegutsen põhiliselt Harju- ja Raplamaal, kuid olen valmis Sind aitama ka üle Eesti ja välismaal.",
        "Keskmine müügiperiood alla 70 päeva – olen ka 5 päevaga kuulutuse panekust broneerimiseni jõudnud.",
        "Koostan personaalse müügistrateegia just Sinu kodule.",
      ];

  // Merge Sanity card text + iconColor with hardcoded icons
  const cards = DEFAULT_SERVICES.map((def, i) => ({
    icon: def.icon,
    title: services?.cards?.[i]?.title ?? def.title,
    body: services?.cards?.[i]?.body ?? def.body,
    iconColor: services?.cards?.[i]?.iconColor ?? "dark",
  }));

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`bg-canvas transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-14 py-16 md:py-40">
        <div className="grid md:grid-cols-[1fr_1.35fr] gap-12 md:gap-20 items-center">

          {/* Left */}
          <div>
            <h2
              className="font-display font-bold text-dark leading-[1.0] mt-4 mb-5"
              style={{ fontSize: "clamp(2.4rem, 4.5vw, 4.2rem)", letterSpacing: "-0.02em" }}
            >
              {sectionTitle}
            </h2>
            <ul className="space-y-2.5 text-muted text-[0.95rem] leading-[1.8] mb-8">
              {bullets.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-[0.45em] w-1.5 h-1.5 rounded-full bg-dark/25 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className={`inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-[0.7rem] font-semibold tracking-[0.14em] uppercase transition-all duration-300 ${btnClass(ctaColor, "bg-accent text-white hover:opacity-90")}`}
            >
              {ctaLabel}
              <svg className="w-3.5 h-3.5 -rotate-45" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Right – 2×2 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.map((s, i) => (
              <div key={i} className="flex flex-col gap-5 rounded-2xl border border-black/10 bg-white p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <div className={`w-11 h-11 rounded-full border border-black/10 flex items-center justify-center flex-shrink-0 p-2.5 ${s.iconColor === "accent" ? "text-accent" : "text-dark"}`}>
                  {s.icon}
                </div>
                <div className="flex flex-col gap-1">
                  <p className="font-display font-semibold text-dark text-[1.1rem] tracking-tight">{s.title}</p>
                </div>
                <p className="text-muted text-[0.84rem] leading-[1.75] mt-auto">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── LISTINGS ───────────────────────────────────────────── */

function ListingCard({ l }: { l: { name: string; address: string; price?: string; image: string; href: string } }) {
  return (
    <a
      href={l.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative overflow-hidden rounded-2xl bg-canvas"
      style={{ aspectRatio: "3/4" }}
    >
      <Image
        src={l.image}
        alt={l.name}
        fill
        unoptimized
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 50vw, 20vw"
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(rgba(0,0,0,0) 36%, rgba(0,0,0,0.88) 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 flex items-end justify-between gap-2">
        <div className="min-w-0">
          {l.price && <p className="text-white font-display font-bold text-[0.72rem] md:text-[0.88rem] mb-0.5 md:mb-1 leading-tight">{l.price}</p>}
          <p className="font-display font-semibold text-white text-[0.75rem] md:text-[0.9rem] leading-tight truncate">{l.name}</p>
          <p className="text-white/50 text-[0.6rem] md:text-[0.68rem] mt-0.5 truncate">{l.address}</p>
        </div>
        <span className="hidden md:inline-flex flex-shrink-0 rounded-full bg-accent text-white px-4 py-1.5 text-[0.65rem] font-semibold tracking-wide uppercase transition-all duration-300 group-hover:opacity-90">
          View
        </span>
      </div>
    </a>
  );
}

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Listings() {
  const { ref, visible } = useFadeIn(0.06);
  const [gridListings, setGridListings] = useState(LISTINGS.slice(0, 9));
  useEffect(() => { setGridListings(shuffled(LISTINGS).slice(0, 9)); }, []);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="listings"
      className={`bg-white transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-14 pt-16 md:pt-40 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h2 className="font-display font-bold text-dark leading-[1.0] mt-4" style={{ fontSize: "clamp(2.4rem, 5vw, 4.2rem)", letterSpacing: "-0.02em" }}>
              Portfellis olevad objektid
            </h2>
            <p className="text-muted text-[0.95rem] leading-[1.8] mt-8 max-w-[380px]">
              Korterid, majad ja krundid - <br />vaata hetkel minu portfellis olevat kinnisvara.
            </p>
          </div>
          <a
            href="https://www.kv.ee/broker/kevinkristoferlaanmets"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 self-start sm:self-end inline-flex items-center gap-2 rounded-full border border-accent bg-accent text-white px-6 py-3 text-[0.7rem] font-semibold tracking-[0.12em] uppercase hover:opacity-90 transition-all duration-300"
          >
            Vaata kõiki
            <svg className="w-3.5 h-3.5 -rotate-45" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {LISTINGS.length === 0 && (
        <div className="mx-auto max-w-7xl px-6 md:px-14 pb-16 md:pb-40">
          <div className="rounded-2xl border border-line bg-canvas px-8 py-12 text-center">
            <p className="text-muted text-sm">
              No listings yet — run <code className="font-mono bg-line/60 px-1.5 py-0.5 rounded text-dark">npm run sync-listings</code> to pull from kv.ee.
            </p>
          </div>
        </div>
      )}

      {LISTINGS.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 md:px-14 pb-16 md:pb-40">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {gridListings.map((l) => (
              <ListingCard key={l.href} l={l} />
            ))}
            <a
              href="https://www.kv.ee/broker/kevinkristoferlaanmets"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl bg-canvas"
              style={{ aspectRatio: "3/4" }}
            >
              {LISTINGS[9] && (
                <Image src={LISTINGS[9].image} alt="More listings" fill unoptimized className="object-cover scale-105" sizes="(max-width: 768px) 50vw, 20vw" />
              )}
              <div className="absolute inset-0 backdrop-blur-md bg-black/40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <span className="font-display font-bold text-white leading-none" style={{ fontSize: "clamp(2.8rem, 5vw, 4rem)" }}>9+</span>
                <span className="text-white/70 text-[0.7rem] font-semibold tracking-[0.15em] uppercase">objekti veel</span>
              </div>
              <div className="absolute inset-0 ring-2 ring-white/0 group-hover:ring-white/30 rounded-2xl transition-all duration-300" />
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─── TESTIMONIALS ───────────────────────────────────────── */

function Testimonials({ testimonials }: { testimonials: SanityTestimonials }) {
  const { ref, visible } = useFadeIn(0.08);
  const items = testimonials?.items?.length ? testimonials.items : DEFAULT_TESTIMONIALS;
  const doubled = [...items, ...items];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`bg-canvas transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-14 py-16 md:py-40">
        <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-start">
          <div className="md:sticky md:top-24">
            <h2
              className="font-display font-bold text-dark leading-[1.0] mt-0 md:mt-35 mb-5"
              style={{ fontSize: "clamp(2.6rem, 5vw, 4.8rem)", letterSpacing: "-0.02em" }}
            >
              Klientide<br />tagasiside
            </h2>
          </div>
          <div className="relative h-[560px] overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 z-10 bg-gradient-to-b from-canvas to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 z-10 bg-gradient-to-t from-canvas to-transparent" />
            <div className="animate-scroll-up">
              {doubled.map((t, i) => (
                <div key={i} className="mb-3 rounded-2xl border border-line bg-white p-6">
                  <p className="mb-5 text-muted leading-[1.85] text-[0.88rem]">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-display font-semibold text-accent text-[0.85rem]">{t.name?.[0]}</span>
                    </div>
                    <div>
                      <div className="text-[0.85rem] font-semibold text-dark">{t.name}</div>
                      <div className="text-[0.6rem] font-semibold tracking-[0.16em] uppercase text-muted mt-0.5">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── SALES PROCESS ──────────────────────────────────────── */

function SalesProcess({ salesProcess }: { salesProcess: SanitySalesProcess }) {
  const steps = salesProcess?.steps?.length ? salesProcess.steps : DEFAULT_STEPS;

  const titleRef = useRef<HTMLDivElement>(null);
  const [titleIn, setTitleIn] = useState(false);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [stepsIn, setStepsIn] = useState<boolean[]>(steps.map(() => false));

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTitleIn(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const obs = stepRefs.current.map((el, i) => {
      if (!el) return null;
      const o = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) setTimeout(() => setStepsIn(p => { const n = [...p]; n[i] = true; return n; }), i * 100);
      }, { threshold: 0.2 });
      o.observe(el);
      return o;
    });
    return () => obs.forEach(o => o?.disconnect());
  }, []);

  return (
    <section className="bg-white py-16 md:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-14">
        <div
          ref={titleRef}
          className={`mb-16 transition-all duration-1000 ${titleIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <h2
            className="font-display font-bold text-dark leading-[0.95]"
            style={{ fontSize: "clamp(3rem, 7vw, 7rem)", letterSpacing: "-0.025em" }}
          >
            Müügiprotsess
          </h2>
        </div>
        <div className="space-y-2.5">
          {steps.map((s, i) => (
            <div
              key={i}
              ref={el => { stepRefs.current[i] = el; }}
              className={`step-reveal group flex items-start gap-4 md:gap-8 rounded-[18px] border border-line bg-white px-5 py-5 md:px-8 md:py-7 hover:shadow-sm transition-all duration-300 ${stepsIn[i] ? "is-visible" : ""}`}
            >
              <span className="font-display font-bold text-[1.8rem] text-line leading-none flex-shrink-0 pt-0.5 group-hover:text-dark/20 transition-colors duration-300">
                {s.num}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-dark text-[1.1rem] leading-snug mb-2 tracking-tight">{s.title}</h3>
                <p className="text-muted leading-[1.8] text-[0.88rem]">{s.body}</p>
              </div>
              <svg className="w-4 h-4 text-line flex-shrink-0 self-center opacity-0 group-hover:opacity-100 group-hover:text-dark transition-all duration-300 -rotate-45" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT ────────────────────────────────────────────── */

function Contact({ contact }: { contact: SanityContact }) {
  const { ref, visible } = useFadeIn(0.1);

  const phone = contact?.phone ?? "+37253935292";
  const email = contact?.email ?? "kevin@kodumaa.ee";
  const kvUrl = contact?.kvUrl ?? "https://www.kv.ee/broker/kevinkristoferlaanmets";
  const smsNumber = contact?.smsNumber ?? phone.replace(/\s/g, "");
  const smsHref = `sms:${smsNumber}`;

  const phoneHref = `tel:${phone.replace(/\s/g, "")}`;
  const mailHref = `mailto:${email}`;

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="contact"
      className={`bg-stone-50 border-t border-stone-200 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12 md:py-28">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-end">

          {/* LEFT col — header + contact links */}
          <div className="min-w-0">

            {/* Header */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white text-xs font-semibold uppercase tracking-widest mb-6">
              Kontakt
            </div>
            <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] tracking-tight text-[#161616] mb-6">
              Alusta oma<br />kinnisvara<br />teekonda.
            </h2>
            <p className="text-stone-500 leading-relaxed text-[0.95rem]">
              Olenemata sellest, kas oled ostja või müüja —<br />olen siin, et aidata sul teha parim otsus.
            </p>

            {/* CTA card — only on mobile, shown after header text */}
            <div className="lg:hidden mt-8">
              <div className="rounded-3xl p-6 border border-stone-200 bg-white">
                <h3 className="text-2xl font-extrabold tracking-tight text-[#161616] mb-3">Valmis alustama?</h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-8 font-normal">
                  Esimene konsultatsioon on alati tasuta. Räägi mulle oma soovidest ja vaatame koos, kuidas saan aidata.
                </p>
                <div className="space-y-3 mb-8">
                  {["Tasuta esialgne konsultatsioon","Kiire vastus — maksimaalselt 24h","Personaalne lähenemine igale kliendile","Läbipaistev protsess algusest lõpuni"].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-stone-600 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  <a href={phoneHref} className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-accent text-white font-semibold text-sm hover:opacity-90 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-25.12a7.93,7.93,0,0,0,.56-.76,16,16,0,0,0,1.28-15.23l-.06-.13L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46Z"/></svg>
                    Helista kohe
                  </a>
                  <a href={smsHref} className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-stone-200 text-[#161616] font-semibold text-sm hover:border-stone-300 hover:bg-stone-50 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H40A16,16,0,0,0,24,64V224a8,8,0,0,0,13,6.22L72,208H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48ZM216,192H69.49a8,8,0,0,0-5.23,1.95L40,214V64H216ZM88,112a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,112Zm0,32a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,144Z"/></svg>
                    Kirjuta mulle
                  </a>
                </div>
              </div>
            </div>

            {/* Contact links */}
            <div className="flex flex-col gap-4 mt-10">
              <a href={phoneHref} className="group flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 hover:shadow-sm transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-[#161616] text-white flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-25.12a7.93,7.93,0,0,0,.56-.76,16,16,0,0,0,1.28-15.23l-.06-.13L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46Z"/></svg>
                </div>
                <div>
                  <div className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-0.5">Telefon</div>
                  <div className="font-bold text-[#161616] text-sm">{phone}</div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="ml-auto text-stone-300" viewBox="0 0 256 256"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"/></svg>
              </a>
              <a href={mailHref} className="group flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 hover:shadow-sm transition-all duration-200 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#161616] text-white flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"/></svg>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-0.5">E-post</div>
                  <div className="font-bold text-[#161616] text-sm truncate">{email}</div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="ml-auto shrink-0 text-stone-300" viewBox="0 0 256 256"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"/></svg>
              </a>
              <a href={kvUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 hover:shadow-sm transition-all duration-200 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#161616] flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors duration-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://www.kv.ee/favicon.ico" alt="KV.EE" width={20} height={20} style={{ filter: "brightness(0) invert(1)" }} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-0.5">KV.EE profiil</div>
                  <div className="font-bold text-[#161616] text-sm truncate">{kvUrl.replace("https://", "")}</div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="ml-auto shrink-0 text-stone-300" viewBox="0 0 256 256"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"/></svg>
              </a>
            </div>
          </div>

          {/* RIGHT col — CTA card (desktop only) */}
          <div className="hidden lg:block min-w-0">
            <div className="rounded-3xl p-6 sm:p-10 border border-stone-200 bg-white">
              <h3 className="text-2xl font-extrabold tracking-tight text-[#161616] mb-3">Valmis alustama?</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-8 font-normal">
                Esimene konsultatsioon on alati tasuta. Räägi mulle oma soovidest ja vaatame koos, kuidas saan aidata.
              </p>
              <div className="space-y-3 mb-8">
                {["Tasuta esialgne konsultatsioon","Kiire vastus — maksimaalselt 24h","Personaalne lähenemine igale kliendile","Läbipaistev protsess algusest lõpuni"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-stone-600 text-sm font-normal">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                <a href={phoneHref} className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-accent text-white font-semibold text-sm hover:opacity-90 transition-all duration-300 hover:-translate-y-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-25.12a7.93,7.93,0,0,0,.56-.76,16,16,0,0,0,1.28-15.23l-.06-.13L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46Z"/></svg>
                  Helista kohe
                </a>
                <a href={smsHref} className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-stone-200 text-[#161616] font-semibold text-sm hover:border-stone-300 hover:bg-stone-50 transition-all duration-300 hover:-translate-y-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M216,48H40A16,16,0,0,0,24,64V224a8,8,0,0,0,13,6.22L72,208H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48ZM216,192H69.49a8,8,0,0,0-5.23,1.95L40,214V64H216ZM88,112a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,112Zm0,32a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,144Z"/></svg>
                  Kirjuta mulle
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─── PAGE CONTENT ───────────────────────────────────────── */

export default function PageContent({ data }: { data: PageData }) {
  return (
    <>
      <Hero hero={data.hero} />
      <ReelsStrip reels={data.reels} />
      <Services services={data.services} />
      <Listings />
      <SalesProcess salesProcess={data.salesProcess} />
      <Testimonials testimonials={data.testimonials} />
      <Contact contact={data.contact} />
    </>
  );
}
