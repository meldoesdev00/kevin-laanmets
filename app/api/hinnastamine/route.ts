import { Resend } from "resend";
import { writeClient } from "@/sanity/lib/client";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = "Kevin Laanmets <hinnastamine@kevinlaanmets.ee>";

type Body = {
  propertyType?: string;
  rooms?: string | null;
  address?: string;
  planToSell?: "Jah" | "Ei";
  name?: string;
  phone?: string;
  email?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(request: Request) {
  const body: Body = await request.json();
  const {
    propertyType,
    rooms,
    address,
    planToSell,
    name,
    phone,
    email,
    utmSource,
    utmMedium,
    utmCampaign,
  } = body;

  const isLand = propertyType === "Maatükk";

  if (
    !propertyType ||
    !address ||
    !planToSell ||
    !name ||
    !phone ||
    !email ||
    (!isLand && !rooms)
  ) {
    return Response.json({ error: "Missing required fields." }, { status: 400 });
  }

  // Iga päring (nii JAH kui EI) salvestatakse Sanity'sse, et Kevin saaks kõiki leadse
  // Studios vaadata — emaili saadame allpool ainult JAH vastuse korral. Kui kirjutus
  // ebaõnnestub (nt puudub veel write-tokenit), ei tohi see vormi esitamist katki teha.
  try {
    await writeClient.create({
      _type: "hinnastamisParing",
      name,
      phone,
      email,
      propertyType,
      rooms: isLand ? undefined : rooms,
      address,
      planToSell,
      utmSource,
      utmMedium,
      utmCampaign,
      submittedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to save hinnastamisParing to Sanity:", err);
  }

  if (planToSell === "Ei") {
    return Response.json({ ok: true });
  }

  const safeName = escapeHtml(name);
  const safeAddress = escapeHtml(address);

  const detailRows = [
    ["Vara tüüp", propertyType],
    !isLand ? ["Tubade arv", rooms ?? ""] : null,
    ["Aadress", address],
    ["Müük 3 kuu jooksul", planToSell],
    ["Nimi", name],
    ["Telefon", phone],
    ["E-mail", email],
  ].filter(Boolean) as [string, string][];

  const adminHtml = `
    <div style="font-family: sans-serif; color:#0a0a0a;">
      <h2 style="margin:0 0 16px;">Uus hinnastamispäring</h2>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        ${detailRows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:4px 12px 4px 0; color:#6b7280; font-size:13px;">${escapeHtml(label)}</td>
            <td style="padding:4px 0; font-size:13px; font-weight:600;">${escapeHtml(value)}</td>
          </tr>`
          )
          .join("")}
      </table>
    </div>
  `;

  const confirmationHtml = `
    <div style="font-family: sans-serif; background:#f6f6f6; padding:32px 16px;">
      <div style="max-width:480px; margin:0 auto; background:#ffffff; border-radius:16px; overflow:hidden; border:1px solid rgba(0,96,57,0.22);">
        <div style="padding:32px; color:#0a0a0a; font-size:14px; line-height:1.7;">
          <p style="margin:0 0 16px;">Tere, ${safeName}!</p>
          <p style="margin:0 0 16px;">Tänan Teid päringu esitamise eest!</p>
          <p style="margin:0 0 16px;">Olen Teie andmed edukalt kätte saanud. Võtan Teiega ühendust hiljemalt 48 tunni jooksul, kui olen esitatud informatsiooni üle vaadanud.</p>
          <p style="margin:0 0 24px;">Seniks tänan Teid usalduse eest ja soovin Teile ilusat päeva!</p>
          <p style="margin:0; font-weight:600;">Lugupidamisega</p>
          <p style="margin:0; font-weight:600;">Kevin Kristofer Laanmets</p>
          <p style="margin:0; color:#6b7280;">Kinnisvaramaakler</p>
        </div>
        <div style="padding:16px 32px; background:#f6f6f6; font-size:11px; color:#9ca3af; border-top:1px solid rgba(0,96,57,0.22);">
          Hinnastatav vara: ${safeAddress}
        </div>
      </div>
    </div>
  `;

  await Promise.all([
    resend.emails.send({
      from: FROM,
      to: "laanmets@gmail.com",
      replyTo: email,
      subject: `Uus hinnastamispäring — ${name}`,
      html: adminHtml,
    }),
    resend.emails.send({
      from: FROM,
      to: email,
      replyTo: "kevin@kodumaa.ee",
      subject: "Täname päringu esitamise eest",
      html: confirmationHtml,
    }),
  ]);

  return Response.json({ ok: true });
}
