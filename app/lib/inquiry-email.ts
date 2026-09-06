import { env } from 'cloudflare:workers';
import type { Inquiry } from '../../db/inquiries';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const SITE_URL = 'https://gordon-machinery-solutions.nikol777.chatgpt.site';

export async function runInquiryEmailAutomation(inquiry: Inquiry) {
  const apiKey = env.RESEND_API_KEY?.trim();
  const from = env.INQUIRY_FROM_EMAIL?.trim();
  const salesEmail = env.SALES_NOTIFICATION_EMAIL?.trim() || 'Sales@GordonMachinerySolutions.com';
  if (!apiKey || !from) return { configured: false, staffSent: false, customerSent: false };

  const equipment = inquiry.equipmentTitle || inquiry.interest;
  const adminUrl = `${SITE_URL}/admin`;
  const staffSubject = `New website inquiry — ${equipment}`;
  const customerSubject = `We received your Gordon Machinery request`;

  const [staff, customer] = await Promise.allSettled([
    sendEmail({
      apiKey,
      from,
      to: salesEmail,
      replyTo: inquiry.email,
      subject: staffSubject,
      idempotencyKey: `gordon-inquiry-${inquiry.id}-staff-v1`,
      html: staffEmailHtml(inquiry, adminUrl),
      text: staffEmailText(inquiry, adminUrl),
    }),
    sendEmail({
      apiKey,
      from,
      to: inquiry.email,
      replyTo: salesEmail,
      subject: customerSubject,
      idempotencyKey: `gordon-inquiry-${inquiry.id}-customer-v1`,
      html: customerEmailHtml(inquiry),
      text: customerEmailText(inquiry),
    }),
  ]);

  return {
    configured: true,
    staffSent: staff.status === 'fulfilled',
    customerSent: customer.status === 'fulfilled',
  };
}

async function sendEmail({
  apiKey,
  from,
  to,
  replyTo,
  subject,
  html,
  text,
  idempotencyKey,
}: {
  apiKey: string;
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  html: string;
  text: string;
  idempotencyKey: string;
}) {
  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({ from, to: [to], reply_to: replyTo, subject, html, text }),
  });
  if (!response.ok) throw new Error(`Email delivery failed with status ${response.status}.`);
}

function staffEmailHtml(inquiry: Inquiry, adminUrl: string) {
  const machineLine = inquiry.equipmentTitle
    ? `<tr><td style="padding:7px 0;color:#777">Machine</td><td style="padding:7px 0;font-weight:700">${escapeHtml(inquiry.equipmentTitle)}</td></tr>`
    : '';
  return emailShell(`
    <p style="margin:0 0 8px;color:#c97812;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase">New website inquiry</p>
    <h1 style="margin:0 0 24px;color:#171a1b;font-size:28px;line-height:1.15">${escapeHtml(inquiry.name)} is interested in ${escapeHtml(inquiry.equipmentTitle || inquiry.interest)}</h1>
    <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.5">
      <tr><td style="width:110px;padding:7px 0;color:#777">Name</td><td style="padding:7px 0;font-weight:700">${escapeHtml(inquiry.name)}</td></tr>
      ${inquiry.company ? `<tr><td style="padding:7px 0;color:#777">Company</td><td style="padding:7px 0;font-weight:700">${escapeHtml(inquiry.company)}</td></tr>` : ''}
      <tr><td style="padding:7px 0;color:#777">Phone</td><td style="padding:7px 0;font-weight:700"><a style="color:#171a1b" href="tel:${escapeAttribute(inquiry.phone)}">${escapeHtml(inquiry.phone)}</a></td></tr>
      <tr><td style="padding:7px 0;color:#777">Email</td><td style="padding:7px 0;font-weight:700"><a style="color:#171a1b" href="mailto:${escapeAttribute(inquiry.email)}">${escapeHtml(inquiry.email)}</a></td></tr>
      <tr><td style="padding:7px 0;color:#777">Interest</td><td style="padding:7px 0;font-weight:700">${escapeHtml(inquiry.interest)}</td></tr>
      ${machineLine}
    </table>
    <div style="margin:24px 0;padding:18px;border-left:4px solid #efa52f;background:#f4f1e9;color:#444;font-size:14px;line-height:1.65;white-space:pre-wrap">${escapeHtml(inquiry.message)}</div>
    <a href="${adminUrl}" style="display:inline-block;padding:14px 20px;background:#171a1b;color:#fff;text-decoration:none;font-size:12px;font-weight:800;letter-spacing:.04em;text-transform:uppercase">Open inquiry inbox</a>
  `);
}

function customerEmailHtml(inquiry: Inquiry) {
  const request = inquiry.equipmentTitle || inquiry.interest;
  return emailShell(`
    <p style="margin:0 0 8px;color:#c97812;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase">Request received</p>
    <h1 style="margin:0 0 18px;color:#171a1b;font-size:30px;line-height:1.15">Thanks, ${escapeHtml(firstName(inquiry.name))}.</h1>
    <p style="margin:0 0 16px;color:#555;font-size:15px;line-height:1.7">We received your request about <strong style="color:#171a1b">${escapeHtml(request)}</strong>. Someone from Gordon Machinery Solutions will follow up as soon as possible during business hours.</p>
    <div style="margin:24px 0;padding:18px;border-left:4px solid #efa52f;background:#f4f1e9">
      <p style="margin:0;color:#777;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase">Your message</p>
      <p style="margin:8px 0 0;color:#444;font-size:14px;line-height:1.65;white-space:pre-wrap">${escapeHtml(inquiry.message)}</p>
    </div>
    <p style="margin:0;color:#555;font-size:14px;line-height:1.7">Need help sooner? Call <a style="color:#c97812;font-weight:700" href="tel:+17707695281">770-769-5281</a> or reply directly to this email.</p>
  `);
}

function emailShell(content: string) {
  return `<!doctype html><html><body style="margin:0;background:#ebe8df;font-family:Arial,Helvetica,sans-serif"><div style="padding:34px 16px"><div style="max-width:620px;margin:0 auto;overflow:hidden;border-top:7px solid #efa52f;background:#fff"><div style="padding:34px">${content}</div><div style="padding:18px 34px;background:#171a1b;color:#aaa;font-size:11px;line-height:1.6">Gordon Machinery Solutions · Heavy equipment sales, rentals and sourcing<br>Smyrna, Georgia · 770-769-5281</div></div></div></body></html>`;
}

function staffEmailText(inquiry: Inquiry, adminUrl: string) {
  return [
    'NEW WEBSITE INQUIRY',
    '',
    `Name: ${inquiry.name}`,
    inquiry.company ? `Company: ${inquiry.company}` : '',
    `Phone: ${inquiry.phone}`,
    `Email: ${inquiry.email}`,
    `Interest: ${inquiry.interest}`,
    inquiry.equipmentTitle ? `Machine: ${inquiry.equipmentTitle}` : '',
    '',
    inquiry.message,
    '',
    `Open the inquiry inbox: ${adminUrl}`,
  ].filter((line) => line !== '').join('\n');
}

function customerEmailText(inquiry: Inquiry) {
  return `Thanks, ${firstName(inquiry.name)}.\n\nWe received your request about ${inquiry.equipmentTitle || inquiry.interest}. Someone from Gordon Machinery Solutions will follow up as soon as possible during business hours.\n\nYour message:\n${inquiry.message}\n\nNeed help sooner? Call 770-769-5281 or reply directly to this email.`;
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || 'there';
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }[character] || character));
}

function escapeAttribute(value: string) {
  return escapeHtml(value.replace(/[\r\n]/g, ''));
}
