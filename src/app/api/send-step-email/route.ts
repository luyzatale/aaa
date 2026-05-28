import { NextResponse } from "next/server";
import { Resend } from "resend";
import { TWELVE_STEPS } from "@/lib/recovery-content";

const STEP_PROMPTS: Record<number, string[]> = {
  1: ["Describe a specific moment when alcohol made your life unmanageable.", "What did you try to control that you could not control?", "What does powerlessness mean to you, in your own words?"],
  2: ["What would a Power greater than yourself feel like to you?", "What would 'restored to sanity' look like in your daily life?", "Have you seen recovery work in others? What does that tell you?"],
  3: ["What does 'turning my will over' mean to you?", "What are you most afraid of letting go of?", "Write the Third Step Prayer in your own words."],
  4: ["List three resentments you currently carry.", "What fears are most present in your life?", "Where have you been dishonest, selfish, or self-seeking recently?"],
  5: ["What does it feel like to have shared your inventory?", "What was the most difficult thing to admit?", "What do you feel free from after this step?"],
  6: ["Which character defects are you most resistant to releasing?", "What would your life look like without these defects?", "Are there any you are not yet ready to give up? Why?"],
  7: ["Write the Seventh Step Prayer in your own words.", "What shortcomings have you asked to be removed?", "What action are you willing to take differently now?"],
  8: ["List people you have harmed. Be thorough.", "For each person, briefly note how you harmed them.", "Are you willing to make amends to all of them?"],
  9: ["Which amends have you made?", "Which amends are you afraid of?", "Are there any amends where you need guidance on how to proceed?"],
  10: ["Where were you wrong today?", "Did you promptly admit it?", "What did you do that was right today?"],
  11: ["Describe your current prayer and meditation practice.", "What does conscious contact with your Higher Power feel like?", "What is your Higher Power asking of you today?"],
  12: ["How have you tried to carry the message to others?", "What spiritual principles are you practising in your daily life?", "How has working these steps changed you?"],
};

export async function POST(req: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Email service not configured." }, { status: 500 });
  }

  const { to, stepNumber, entries } = await req.json();
  if (!to || !stepNumber) {
    return NextResponse.json({ error: "Email and step number required." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const step = TWELVE_STEPS[stepNumber - 1];
  const prompts = STEP_PROMPTS[stepNumber] || [];

  const promptsHtml = prompts
    .map((prompt, idx) => {
      const answer = entries?.[`step-${stepNumber}-${idx}`]?.trim() || "";
      return `
        <div style="margin-bottom:24px;">
          <p style="font-size:14px;color:#555;margin:0 0 8px;">${prompt}</p>
          <div style="background:#f9f9f9;border-left:3px solid #7a9e7e;padding:12px 16px;border-radius:4px;font-size:14px;color:#333;white-space:pre-wrap;">${answer || "<em style='color:#aaa'>No answer written yet.</em>"}</div>
        </div>`;
    })
    .join("");

  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#333;">
      <p style="font-size:12px;color:#999;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">A@AA Serenity Path — Step Work</p>
      <h1 style="font-size:22px;font-weight:400;margin:0 0 4px;">Step ${step.number}: ${step.shortText}</h1>
      <p style="font-size:13px;color:#888;margin:0 0 24px;font-style:italic;">${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
      <blockquote style="border-left:3px solid #c8a96e;margin:0 0 28px;padding:12px 16px;background:#fdfaf5;font-style:italic;font-size:14px;color:#555;">&ldquo;${step.text}&rdquo;</blockquote>
      <h2 style="font-size:15px;font-weight:600;color:#7a9e7e;margin:0 0 20px;text-transform:uppercase;letter-spacing:0.5px;">Reflection Prompts</h2>
      ${promptsHtml}
      <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
      <p style="font-size:11px;color:#bbb;text-align:center;">Sent from A@AA Serenity Path &mdash; your writing stays with you.</p>
    </div>`;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: "A@AA Serenity Path <onboarding@resend.dev>",
    to,
    subject: `Step Work — Step ${step.number}: ${step.shortText}`,
    html,
  });

  if (error) {
    console.error("[send-step-email] Resend error:", error);
    return NextResponse.json({ error: "Failed to send email. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
