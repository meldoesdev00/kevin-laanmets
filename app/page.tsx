"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import listingsData from "../data/listings.json";
import reelsData from "../data/reels.json";

/* ─── DATA ───────────────────────────────────────────────── */

type ReelEntry = { src: string; poster: string | null };
const REELS = reelsData as ReelEntry[];

const SERVICES = [
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

const TESTIMONIALS = [
  {
    name: "Ants K.",
    role: "Kodu ostja",
    text: "Kevini abiga leidsime unistuste kodu kolme nädalaga. Ta oli professionaalne, vastutulelev ja mõistis täpselt, mida otsisime. Soovitan soojalt!",
  },
  {
    name: "Maris L.",
    role: "Kodu müüja",
    text: "Kevin müüs meie korteri oodatust kõrgema hinnaga. Tema turuanalüüs ja müügistrateegia olid täppi lastud. Ei saaks tulemusega rohkem rahul olla.",
  },
  {
    name: "Liis T.",
    role: "Esmakordne ostja",
    text: "Kevin selgitas iga sammu kannatlikult ja põhjalikult — tundsin end kogu protsessi vältel kindlalt. Väga soovitatav maakler esmakordsele ostjale.",
  },
  {
    name: "Jaan M.",
    role: "Kinnisvarainvestor",
    text: "Kevini teenindus oli algusest lõpuni suurepärane. Suhtlus oli selge ja kiire — tundsime, et oleme täiesti usaldusväärsetes kätes.",
  },
  {
    name: "Kadri L.",
    role: "Üürnik",
    text: "Kevin leidis meile täiusliku üürikorteri, mis vastas kõigile meie kriteeriumidele. Sujuv protsess, suurepärane tähelepanu detailidele ja päriselt isiklik lähenemine.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Tutvumine ja eesmärkide kaardistamine",
    body: "Tulen kohale, vaatan objekti üle ning räägime läbi sinu eesmärgid, ajaraami ja ootused.",
  },
  {
    num: "02",
    title: "Turuanalüüs ja hinnastamine",
    body: "Analüüsin turgu, võrdlen sarnaseid tehinguid ning koostan strateegilise hinnastamise.",
  },
  {
    num: "03",
    title: "Ettevalmistus ja professionaalne esitlus",
    body: "Koostame müügimaterjalid, korraldame professionaalse pildistamise või filmimise ning valmistame objekti ette nii, et see kõnetaks õigeid ostjaid.",
  },
  {
    num: "04",
    title: "Aktiivne turundus ja müük",
    body: "Objekt jõuab sihitud kanalitesse. Juhin näitamisi, suhtlen ostuhuvilistega ning hoian kogu protsessi vältel sind kursis.",
  },
  {
    num: "05",
    title: "Läbirääkimised ja edukas tehing",
    body: "Esindan sinu huve läbirääkimistel, koordineerin notariga, teen ostueelse kontrollin ning viin tehingu lõpuni.",
  },
];


// Listings are populated by: npm run sync-listings
// Each entry: { name, address, price, image, href }
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

/* ─── NAVBAR ─────────────────────────────────────────────── */

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-6 md:px-14 h-16 flex items-center">
        <Image
          src="/kevin_logo.png"
          alt="Kevin Laanmets"
          width={140}
          height={44}
          className="h-9 w-auto object-contain"
        />
      </div>
    </nav>
  );
}

/* ─── HERO ───────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="bg-white pt-16">
      <div className="max-w-7xl mx-auto px-6 md:px-14 w-full py-12 md:py-20">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 lg:gap-16 lg:items-center">

          {/* Left – text */}
          <div>
            <h1
              className="font-display font-extrabold leading-[1.0] tracking-tight mb-6 text-[#161616]"
              style={{ fontSize: "clamp(2.5rem,6.5vw,5.5rem)", opacity: 0, animation: "fadeUp .65s .2s ease forwards" }}
            >
              Sinu kinnisvara.<br />
              <span style={{ color: "#B8775A" }}>Minu</span> prioriteet.
            </h1>
            <p
              className="text-stone-500 text-base md:text-lg leading-relaxed max-w-lg mb-8 font-normal"
              style={{ opacity: 0, animation: "fadeUp .65s .35s ease forwards" }}
            >
              Läbipaistev, aus ja detailidele orienteeritud maakler, kes paneb sinu eesmärgid alati esikohale.
            </p>
            <div className="flex flex-wrap gap-4" style={{ opacity: 0, animation: "fadeUp .65s .45s ease forwards" }}>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#161616] text-white font-semibold text-sm hover:bg-[#B8775A] transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
              >
                Tasuta kinnisvara hinnastamine
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </a>
              <a
                href="https://www.kv.ee/broker/kevinkristoferlaanmets"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-stone-200 text-stone-600 font-semibold text-sm hover:border-stone-300 hover:text-[#161616] transition-all duration-200"
              >
                Suundu minu portfelli
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
              </a>
            </div>
          </div>

          {/* Right – photo, no stat bubbles */}
          <div style={{ opacity: 0, animation: "fadeUp .7s .3s ease forwards" }}>
            <div
              className="relative rounded-3xl overflow-hidden bg-stone-100 w-full max-w-md mx-auto lg:ml-auto lg:mr-0 border border-stone-200"
              style={{ aspectRatio: "3/4" }}
            >
              <Image
                src="/laanmets.jpg"
                alt="Kevin Laanmets"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 90vw, 44vw"
              />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-stone-100/50 to-transparent" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─── REELS STRIP ────────────────────────────────────────── */

function ReelsStrip() {
  const videos = REELS.slice(0, 8);

  return (
    <section className="bg-stone-50 border-y border-stone-200 py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {videos.map((r, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden bg-stone-900"
              style={{ aspectRatio: "9/16" }}
            >
              <video
                src={r.src}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── ABOUT ──────────────────────────────────────────────── */

function About() {
  const { ref, visible } = useFadeIn(0.08);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="about"
      className={`bg-white transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-14 py-16 md:py-40">
        <div className="grid md:grid-cols-[1fr_1.15fr] gap-10 md:gap-20 items-center">

          {/* Photo */}
          <div className="relative">
            <div
              className="relative overflow-hidden rounded-[18px] bg-canvas"
              style={{ aspectRatio: "3/4", boxShadow: "0 32px 80px -16px rgba(0,0,0,0.18)" }}
            >
              <Image
                src="/laanmets.jpg"
                alt="Laanmets – Real Estate Broker"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 90vw, 44vw"
              />
            </div>
          </div>

          {/* Text */}
          <div>
            <h2
              className="font-display font-bold text-dark leading-[1.0] mt-4 mb-5"
              style={{ fontSize: "clamp(2.6rem, 5vw, 4.8rem)", letterSpacing: "-0.02em" }}
            >
              Usaldus,<br />
              läbipaistvus ja kindel tulemus
            </h2>
            <div className="space-y-5 text-muted leading-[1.85] text-[0.96rem]">
              <p>
                Minu jaoks on maakleritöös kõige olulisemad asjad usaldus, läbipaistev suhtlus ja kliendi eesmärkide saavutamine. Olen maakler, kes peab oluliseks selget suhtlust, ausust ja lahendusi, mis viivad Sind soovitud tulemuseni.
              </p>
            </div>

            <div className="mt-10 pt-10 border-t border-line grid grid-cols-3 gap-8">
              {[["100+", "Rahulolevat klienti"], ["68", "Päeva keskmine tehinguperiood"], ["5+", "Aastat müügikogemust"]].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display font-bold text-[2.8rem] leading-none text-dark">{n}</div>
                  <div className="mt-2 text-[0.62rem] font-semibold tracking-[0.18em] uppercase text-muted">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── SERVICES ───────────────────────────────────────────── */

function Services() {
  const { ref, visible } = useFadeIn(0.08);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`bg-canvas transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-14 py-16 md:py-40">
        <div className="grid md:grid-cols-[1fr_1.35fr] gap-12 md:gap-20 items-center">

          {/* Left – heading + CTA */}
          <div>
            <h2
              className="font-display font-bold text-dark leading-[1.0] mt-4 mb-5"
              style={{ fontSize: "clamp(2.4rem, 4.5vw, 4.2rem)", letterSpacing: "-0.02em" }}
            >
              Pakutavad teenused
            </h2>
            <ul className="space-y-2.5 text-muted text-[0.95rem] leading-[1.8] mb-8">
              {[
                "Tegutsen põhiliselt Harju- ja Raplamaal, kuid olen valmis Sind aitama ka üle Eesti ja välismaal.",
                "Keskmine müügiperiood alla 70 päeva – olen ka 5 päevaga kuulutuse panekust broneerimiseni jõudnud.",
                "Koostan personaalse müügistrateegia just Sinu kodule.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="mt-[0.45em] w-1.5 h-1.5 rounded-full bg-dark/25 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className="inline-flex items-center gap-2.5 rounded-full bg-accent text-white px-7 py-3.5 text-[0.7rem] font-semibold tracking-[0.14em] uppercase hover:opacity-90 transition-opacity duration-300"
            >
              Broneeri<br />
              konsultatsioon
              <svg className="w-3.5 h-3.5 -rotate-45" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Right – 2×2 card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SERVICES.map((s, i) => (
              <div
                key={i}
                className="flex flex-col gap-5 rounded-2xl border border-black/10 bg-white p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-full border border-black/10 flex items-center justify-center text-dark flex-shrink-0 p-2.5">
                  {s.icon}
                </div>
                {/* Text */}
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
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(rgba(0,0,0,0) 36%, rgba(0,0,0,0.88) 100%)" }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 flex items-end justify-between gap-2">
        <div className="min-w-0">
          {l.price && (
            <p className="text-white font-display font-bold text-[0.72rem] md:text-[0.88rem] mb-0.5 md:mb-1 leading-tight">{l.price}</p>
          )}
          <p className="font-display font-semibold text-white text-[0.75rem] md:text-[0.9rem] leading-tight truncate">
            {l.name}
          </p>
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
  useEffect(() => {
    setGridListings(shuffled(LISTINGS).slice(0, 9));
  }, []);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="listings"
      className={`bg-white transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      {/* ── Header row ── */}
      <div className="mx-auto max-w-7xl px-6 md:px-14 pt-16 md:pt-40 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h2
              className="font-display font-bold text-dark leading-[1.0] mt-4"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4.2rem)", letterSpacing: "-0.02em" }}
            >
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
            className="flex-shrink-0 self-start sm:self-end inline-flex items-center gap-2 rounded-full border border-accent bg-accent text-white px-6 py-3 text-[0.7rem] font-semibold tracking-[0.12em] uppercase hover:bg-accent hover:text-white transition-all duration-300"
          >
            Vaata kõiki
            <svg className="w-3.5 h-3.5 -rotate-45" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* ── Empty state ── */}
      {LISTINGS.length === 0 && (
        <div className="mx-auto max-w-7xl px-6 md:px-14 pb-16 md:pb-40">
          <div className="rounded-2xl border border-line bg-canvas px-8 py-12 text-center">
            <p className="text-muted text-sm">
              No listings yet — run <code className="font-mono bg-line/60 px-1.5 py-0.5 rounded text-dark">npm run sync-listings</code> to pull from kv.ee.
            </p>
          </div>
        </div>
      )}

      {/* ── 5×2 grid ── */}
      {LISTINGS.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 md:px-14 pb-16 md:pb-40">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {gridListings.map((l) => (
              <ListingCard key={l.href} l={l} />
            ))}

            {/* 10th card — blurred "9+" teaser */}
            <a
              href="https://www.kv.ee/broker/kevinkristoferlaanmets"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl bg-canvas"
              style={{ aspectRatio: "3/4" }}
            >
              {/* Use the 10th listing image as background (index 9) */}
              {LISTINGS[9] && (
                <Image
                  src={LISTINGS[9].image}
                  alt="More listings"
                  fill
                  unoptimized
                  className="object-cover scale-105"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
              )}
              {/* Blur overlay */}
              <div className="absolute inset-0 backdrop-blur-md bg-black/40" />
              {/* 9+ label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <span
                  className="font-display font-bold text-white leading-none"
                  style={{ fontSize: "clamp(2.8rem, 5vw, 4rem)" }}
                >
                  9+
                </span>
                <span className="text-white/70 text-[0.7rem] font-semibold tracking-[0.15em] uppercase">
                  objekti veel
                </span>
              </div>
              {/* Hover ring */}
              <div className="absolute inset-0 ring-2 ring-white/0 group-hover:ring-white/30 rounded-2xl transition-all duration-300" />
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─── TESTIMONIALS ───────────────────────────────────────── */


function Testimonials() {
  const { ref, visible } = useFadeIn(0.08);
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`bg-canvas transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-14 py-16 md:py-40">
        <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-start">

          {/* Left sticky */}
          <div className="md:sticky md:top-24">
            <h2
              className="font-display font-bold text-dark leading-[1.0] mt-0 md:mt-35 mb-5"
              style={{ fontSize: "clamp(2.6rem, 5vw, 4.8rem)", letterSpacing: "-0.02em" }}
            >
              Klientide<br />tagasiside
            </h2>
          </div>

          {/* Right scroll */}
          <div className="relative h-[560px] overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 z-10 bg-gradient-to-b from-canvas to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 z-10 bg-gradient-to-t from-canvas to-transparent" />
            <div className="animate-scroll-up">
              {doubled.map((t, i) => (
                <div key={i} className="mb-3 rounded-2xl border border-line bg-white p-6">
                  <p className="mb-5 text-muted leading-[1.85] text-[0.88rem]">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-display font-semibold text-accent text-[0.85rem]">{t.name[0]}</span>
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

function SalesProcess() {
  const titleRef = useRef<HTMLDivElement>(null);
  const [titleIn, setTitleIn] = useState(false);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [stepsIn, setStepsIn] = useState<boolean[]>(STEPS.map(() => false));

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
          {STEPS.map((s, i) => (
            <div
              key={i}
              ref={el => { stepRefs.current[i] = el; }}
              className={`step-reveal group flex items-start gap-4 md:gap-8 rounded-[18px] border border-line bg-white px-5 py-5 md:px-8 md:py-7 hover:shadow-sm transition-all duration-300 ${stepsIn[i] ? "is-visible" : ""}`}
            >
              <span className="font-display font-bold text-[1.8rem] text-line leading-none flex-shrink-0 pt-0.5 group-hover:text-dark/20 transition-colors duration-300">
                {s.num}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-dark text-[1.1rem] leading-snug mb-2 tracking-tight">
                  {s.title}
                </h3>
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

function Contact() {
  const { ref, visible } = useFadeIn(0.1);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="contact"
      className={`bg-stone-50 border-t border-stone-200 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-12 md:py-28">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-end">

          {/* Contact links — first on mobile, left on desktop */}
          <div className="lg:order-1 min-w-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white text-xs font-semibold uppercase tracking-widest mb-6">
              Kontakt
            </div>
            <h2 className="text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] tracking-tight text-[#161616] mb-6">
              Alusta oma<br />kinnisvara<br />teekonda.
            </h2>
            <p className="text-stone-500 leading-relaxed mb-10 text-[0.95rem]">
              Olenemata sellest, kas oled ostja või müüja —<br />olen siin, et aidata sul teha parim otsus.
            </p>

            <div className="flex flex-col gap-4">
              <a href="tel:+37253935292" className="group flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 hover:shadow-sm transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-[#161616] text-white flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-25.12a7.93,7.93,0,0,0,.56-.76,16,16,0,0,0,1.28-15.23l-.06-.13L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46Z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-0.5">Telefon</div>
                  <div className="font-bold text-[#161616] text-sm">+372 5393 5292</div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="ml-auto text-stone-300" viewBox="0 0 256 256">
                  <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"/>
                </svg>
              </a>

              <a href="mailto:kevin@kodumaa.ee" className="group flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 hover:shadow-sm transition-all duration-200 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#161616] text-white flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-0.5">E-post</div>
                  <div className="font-bold text-[#161616] text-sm truncate">kevin@kodumaa.ee</div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="ml-auto shrink-0 text-stone-300" viewBox="0 0 256 256">
                  <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"/>
                </svg>
              </a>

              <a href="https://www.kv.ee/broker/kevinkristoferlaanmets" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 hover:border-stone-300 hover:shadow-sm transition-all duration-200 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#161616] flex items-center justify-center shrink-0 group-hover:bg-accent transition-colors duration-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://www.kv.ee/favicon.ico" alt="KV.EE" width={20} height={20} style={{ filter: "brightness(0) invert(1)" }} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-0.5">KV.EE profiil</div>
                  <div className="font-bold text-[#161616] text-sm truncate">kv.ee/broker/kevinkristoferlaanmets</div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="ml-auto shrink-0 text-stone-300" viewBox="0 0 256 256">
                  <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* CTA card — second on mobile, right on desktop */}
          <div className="lg:order-2 min-w-0">
            <div className="rounded-3xl p-6 sm:p-10 border border-stone-200 bg-white relative overflow-hidden">
              <h3 className="text-2xl font-extrabold tracking-tight text-[#161616] mb-3">
                Valmis alustama?
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-8 font-normal">
                Esimene konsultatsioon on alati tasuta. Räägi mulle oma soovidest ja vaatame koos, kuidas saan aidata.
              </p>

              <div className="space-y-3 mb-8">
                {[
                  "Tasuta esialgne konsultatsioon",
                  "Kiire vastus — maksimaalselt 24h",
                  "Personaalne lähenemine igale kliendile",
                  "Läbipaistev protsess algusest lõpuni",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-stone-600 text-sm font-normal">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href="tel:+37253935292"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-accent text-white font-semibold text-sm hover:opacity-90 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-25.12a7.93,7.93,0,0,0,.56-.76,16,16,0,0,0,1.28-15.23l-.06-.13L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46Z"/>
                  </svg>
                  Helista kohe
                </a>
                <a
                  href="https://wa.me/37253935292?text=Tere%2C+sooviksin+rohkem+infot."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border border-stone-200 text-[#161616] font-semibold text-sm hover:border-stone-300 hover:bg-stone-50 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM203.43,64,128,133.15,52.57,64ZM216,192H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"/>
                  </svg>
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



/* ─── PAGE ───────────────────────────────────────────────── */

export default function Page() {
  return (
    <>
      <Navbar />
      <Hero />
      <ReelsStrip />
      <About />
      <Services />
      <Listings />
      <SalesProcess />
      <Testimonials />
      <Contact />
    </>
  );
}
