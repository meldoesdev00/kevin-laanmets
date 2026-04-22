import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "djktjdvq",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN,
});

const docs = [
  {
    _id: "hero",
    _type: "hero",
    headline: "Müü või üüri oma kinnisvara",
    subtext:
      "Aitan nii ostjaid kui müüjaid kogu protsessi vältel alates esimesest konsultatsioonist kuni eduka tehingu lõpule viimiseni.",
    primaryButton: { label: "Minu portfell", href: "https://www.kv.ee/broker/kevinkristoferlaanmets", color: "accent" },
    secondaryButton: { label: "Broneeri tasuta konsultatsioon", href: "#contact", color: "accent-outline" },
    instagramUrl: "https://www.instagram.com/kevin.laanmets",
    facebookUrl: "https://www.facebook.com/kevin.laanmets",
    statCards: [
      { _key: "card1", _type: "object", value: "100+", label: "Klienti aidatud", color: "dark", position: "top-left" },
      { _key: "card2", _type: "object", value: "~68p", label: "Keskmine tehinguaeg", color: "accent", position: "mid-left" },
      { _key: "card3", _type: "object", value: "TOP 1", label: "Kodumaa käive 2025", color: "dark", position: "top-right" },
      { _key: "card4", _type: "object", value: "5+", label: "Aastat müügikogemust", color: "accent", position: "bottom-right" },
    ],
  },
  {
    _id: "services",
    _type: "services",
    sectionTitle: "Pakutavad teenused",
    bullets: [
      "Tegutsen põhiliselt Harju- ja Raplamaal, kuid olen valmis Sind aitama ka üle Eesti ja välismaal.",
      "Keskmine müügiperiood alla 70 päeva – olen ka 5 päevaga kuulutuse panekust broneerimiseni jõudnud.",
      "Koostan personaalse müügistrateegia just Sinu kodule.",
    ],
    ctaLabel: "Broneeri konsultatsioon",
    ctaColor: "accent",
    cards: [
      { _key: "svc1", _type: "object", title: "Kinnisvara müük", body: "Aitan müüa kortereid ja maju läbimõeldult ja selge strateegiaga. Alustan turuanalüüsist ja hinnastamisest ning juhin kogu müügiprotsessi algusest kuni tehinguni.", iconColor: "dark" },
      { _key: "svc2", _type: "object", title: "Kinnisvara ost", body: "Toetan oma kliente oluliste otsuste ja läbirääkimiste juures. Aitan hinnata riske, hoida selget pilti ning jõuda eduka tehinguni.", iconColor: "dark" },
      { _key: "svc3", _type: "object", title: "Kinnisvara üürimine", body: "Aitan kinnisvara üürileandmisel leida Sulle sobiva üürniku. Juhin kogu protsessi nii, et see oleks korrektne, selge ja ajaliselt tõhus.", iconColor: "dark" },
      { _key: "svc4", _type: "object", title: "Koostöö partneritega", body: "Teen koostööd usaldusväärsete koostööpartneritega alates pankadest kuni sisekujundajateni, et tagada tehingu sujuv kulg.", iconColor: "dark" },
    ],
  },
  {
    _id: "testimonials",
    _type: "testimonials",
    items: [
      { _key: "t1", _type: "object", name: "Ants K.", role: "Kodu ostja", text: "Kevini abiga leidsime unistuste kodu kolme nädalaga. Ta oli professionaalne, vastutulelev ja mõistis täpselt, mida otsisime. Soovitan soojalt!" },
      { _key: "t2", _type: "object", name: "Maris L.", role: "Kodu müüja", text: "Kevin müüs meie korteri oodatust kõrgema hinnaga. Tema turuanalüüs ja müügistrateegia olid täppi lastud. Ei saaks tulemusega rohkem rahul olla." },
      { _key: "t3", _type: "object", name: "Liis T.", role: "Esmakordne ostja", text: "Kevin selgitas iga sammu kannatlikult ja põhjalikult — tundsin end kogu protsessi vältel kindlalt. Väga soovitatav maakler esmakordsele ostjale." },
      { _key: "t4", _type: "object", name: "Jaan M.", role: "Kinnisvarainvestor", text: "Kevini teenindus oli algusest lõpuni suurepärane. Suhtlus oli selge ja kiire — tundsime, et oleme täiesti usaldusväärsetes kätes." },
      { _key: "t5", _type: "object", name: "Kadri L.", role: "Üürnik", text: "Kevin leidis meile täiusliku üürikorteri, mis vastas kõigile meie kriteeriumidele. Sujuv protsess, suurepärane tähelepanu detailidele ja päriselt isiklik lähenemine." },
    ],
  },
  {
    _id: "salesProcess",
    _type: "salesProcess",
    steps: [
      { _key: "s1", _type: "object", num: "01", title: "Tutvumine ja eesmärkide kaardistamine", body: "Tulen kohale, vaatan objekti üle ning räägime läbi sinu eesmärgid, ajaraami ja ootused." },
      { _key: "s2", _type: "object", num: "02", title: "Turuanalüüs ja hinnastamine", body: "Analüüsin turgu, võrdlen sarnaseid tehinguid ning koostan strateegilise hinnastamise." },
      { _key: "s3", _type: "object", num: "03", title: "Ettevalmistus ja professionaalne esitlus", body: "Koostame müügimaterjalid, korraldame professionaalse pildistamise või filmimise ning valmistame objekti ette nii, et see kõnetaks õigeid ostjaid." },
      { _key: "s4", _type: "object", num: "04", title: "Aktiivne turundus ja müük", body: "Objekt jõuab sihitud kanalitesse. Juhin näitamisi, suhtlen ostuhuvilistega ning hoian kogu protsessi vältel sind kursis." },
      { _key: "s5", _type: "object", num: "05", title: "Läbirääkimised ja edukas tehing", body: "Esindan sinu huve läbirääkimistel, koordineerin notariga, teen ostueelse kontrollin ning viin tehingu lõpuni." },
    ],
  },
  {
    _id: "contact",
    _type: "contact",
    phone: "+372 5393 5292",
    email: "kevin@kodumaa.ee",
    kvUrl: "https://www.kv.ee/broker/kevinkristoferlaanmets",
    smsNumber: "+37253935292",
    ctaHeadline: "Valmis alustama?",
    ctaSubtext: "Esimene konsultatsioon on alati tasuta. Räägi mulle oma soovidest ja vaatame koos, kuidas saan aidata.",
  },
];

console.log("Seeding Sanity documents...\n");

for (const doc of docs) {
  try {
    await client.createOrReplace(doc);
    console.log(`✓ ${doc._id}`);
  } catch (err) {
    console.error(`✗ ${doc._id}:`, err.message);
  }
}

console.log("\nDone! Open /studio to verify.");
