"use client";

import { useEffect, useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { useHinnastamine } from "./HinnastamineContext";

type PropertyType = "" | "Korter" | "Maja" | "Ridaelamu" | "Suvila" | "Maatükk";
type PlanToSell = "" | "Jah" | "Ei";

const PROPERTY_TYPES: PropertyType[] = ["Korter", "Maja", "Ridaelamu", "Suvila", "Maatükk"];
const ROOM_OPTIONS = ["1", "2", "3", "4", "5", "6+"];

const inputClass =
  "w-full rounded-xl border border-black/15 bg-stone-50 px-3.5 py-2.5 text-sm text-dark outline-none transition-colors focus:border-accent appearance-none";
const labelClass =
  "block text-[11px] font-medium text-black/40 uppercase tracking-[0.08em] mb-1.5";

function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
      <path d="M2 4l4 4 4-4" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HinnastamineModal() {
  const { isOpen, close } = useHinnastamine();

  if (!isOpen) return null;
  return <ModalContent onClose={close} />;
}

function ModalContent({ onClose }: { onClose: () => void }) {
  const [propertyType, setPropertyType] = useState<PropertyType>("");
  const [rooms, setRooms] = useState("");
  const [address, setAddress] = useState("");
  const [planToSell, setPlanToSell] = useState<PlanToSell>("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedPlan, setSubmittedPlan] = useState<PlanToSell | null>(null);

  const isLand = propertyType === "Maatükk";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const res = await fetch("/api/hinnastamine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyType,
          rooms: isLand ? null : rooms,
          address,
          planToSell,
          name,
          phone,
          email,
          utmSource: params.get("utm_source") ?? undefined,
          utmMedium: params.get("utm_medium") ?? undefined,
          utmCampaign: params.get("utm_campaign") ?? undefined,
        }),
      });
      if (!res.ok) throw new Error();

      if (planToSell === "Jah") {
        sendGAEvent("event", "generate_lead", {
          property_type: propertyType,
          plan_to_sell: "Jah",
        });
      } else {
        sendGAEvent("event", "hinnastamine_ei", {
          property_type: propertyType,
          plan_to_sell: "Ei",
        });
      }

      setSubmittedPlan(planToSell);
    } catch {
      setError("Päringu saatmine ebaõnnestus. Palun proovi uuesti.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 backdrop-blur-sm p-5"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[520px] max-h-[90vh] flex flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-black/[0.07] flex-shrink-0">
          <p className="font-display font-semibold text-dark text-[1.05rem] tracking-tight">
            Kinnisvara hinnastamine
          </p>
          <button
            onClick={onClose}
            aria-label="Sulge"
            className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center text-black/50 hover:bg-black/5 transition-colors duration-200 flex-shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-7 py-6 flex-1">
          {submittedPlan ? (
            <ThankYou plan={submittedPlan} onClose={onClose} />
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className={labelClass}>Mis tüüpi vara soovite hinnastada?</label>
                <div className="relative">
                  <select
                    required
                    value={propertyType}
                    onChange={(e) => {
                      const v = e.target.value as PropertyType;
                      setPropertyType(v);
                      if (v === "Maatükk") setRooms("");
                    }}
                    className={`${inputClass} pr-9 cursor-pointer`}
                  >
                    <option value="" disabled>Vali vara tüüp</option>
                    {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <Chevron />
                </div>
              </div>

              {!isLand && (
                <div>
                  <label className={labelClass}>Mitme toaline antud vara on?</label>
                  <div className="relative">
                    <select
                      required={!isLand}
                      value={rooms}
                      onChange={(e) => setRooms(e.target.value)}
                      className={`${inputClass} pr-9 cursor-pointer`}
                    >
                      <option value="" disabled>Vali tubade arv</option>
                      {ROOM_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <Chevron />
                  </div>
                </div>
              )}

              <div>
                <label className={labelClass}>Mis aadressil hinnastamist vajav vara asub?</label>
                <input
                  required
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Tänav, maja, linn"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Kas plaanite antud vara järgneva kolme kuu jooksul müüki panna?</label>
                <div className="relative">
                  <select
                    required
                    value={planToSell}
                    onChange={(e) => setPlanToSell(e.target.value as PlanToSell)}
                    className={`${inputClass} pr-9 cursor-pointer`}
                  >
                    <option value="" disabled>Vali vastus</option>
                    <option value="Jah">Jah</option>
                    <option value="Ei">Ei</option>
                  </select>
                  <Chevron />
                </div>
              </div>

              <div>
                <label className={labelClass}>Teie nimi</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Eesnimi Perenimi"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Telefoninumber</label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+372 ..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Meiliaadress</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@näide.ee"
                    className={inputClass}
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="mt-1 inline-flex items-center justify-center gap-2.5 rounded-full bg-accent px-7 py-3.5 text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-white transition-all duration-300 hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? "Saadan..." : "Saada päring"}
              </button>
              <p className="text-[11px] text-black/30 leading-[1.6] text-center">
                Andmeid kasutatakse üksnes hinnastamispäringule vastamiseks.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function ThankYou({ plan, onClose }: { plan: PlanToSell; onClose: () => void }) {
  const body =
    plan === "Jah" ? (
      <>
        <p className="mb-4">
          Tänan Teid päringu esitamise eest!
        </p>
        <p className="mb-4">
          Olen Teie andmed edukalt kätte saanud. Võtan Teiega ühendust hiljemalt 48 tunni jooksul, kui olen esitatud informatsiooni üle vaadanud.
        </p>
        <p>
          Seniks tänan Teid usalduse eest ja soovin Teile ilusat päeva!
        </p>
      </>
    ) : (
      <>
        <p className="mb-4">
          Täname Teid päringu esitamise eest!
        </p>
        <p className="mb-4">
          Hindame Teie huvi meie teenuse vastu. Suurenenud töökoormuse tõttu ei pruugi meil olla võimalik vastata kõikidele saabunud päringutele.
        </p>
        <p className="mb-4">
          Teeme omalt poolt parima, et Teie taotlus esimesel võimalusel üle vaadata. Kui Te ei ole meilt mõistliku aja jooksul tagasisidet saanud või Teil on kiireloomulisi küsimusi, palume võtta ühendust telefoni teel.
        </p>
        <p>
          Täname mõistva suhtumise eest ning soovime Teile ilusat päeva!
        </p>
      </>
    );

  return (
    <div className="py-2">
      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-5">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-accent">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="text-[0.9rem] leading-[1.75] text-dark">{body}</div>
      <p className="mt-6 text-[0.85rem] font-semibold text-dark">
        Lugupidamisega<br />Kevin Kristofer Laanmets<br />Kinnisvaramaakler
      </p>
      <button
        onClick={onClose}
        className="mt-7 w-full inline-flex items-center justify-center rounded-full border border-black/15 px-7 py-3 text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-dark hover:bg-black/5 transition-all duration-300"
      >
        Sulge
      </button>
    </div>
  );
}
