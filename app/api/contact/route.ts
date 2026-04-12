import nodemailer from "nodemailer";

export async function POST(request: Request) {
  const { name, email, phone, message } = await request.json();

  if (!name || !email || !message) {
    return Response.json({ error: "Missing required fields." }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Laanmets Website" <${process.env.GMAIL_USER}>`,
    to: "laanmets@gmail.com",
    replyTo: email,
    subject: `New contact from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      ``,
      message,
    ]
      .filter((l) => l !== null)
      .join("\n"),
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
      <hr/>
      <p>${message.replace(/\n/g, "<br/>")}</p>
    `,
  });

  return Response.json({ ok: true });
}
