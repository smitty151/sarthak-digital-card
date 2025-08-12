// app/api/vcard/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Update these fields as needed:
  const name = 'Sarthak Mittal';
  const first = 'Sarthak';
  const last = 'Mittal';
  const email = 'mittal.sart@gmail.com';
  // You said you don’t want phone visible on the site, but it’s fine in the vCard:
  const phone = '+91 8073877696';
  const location = 'Bengaluru, India';
  const linkedin = 'https://www.linkedin.com/in/sarthakmittal115/';
  const calendly = 'https://calendly.com/mittal-sart/30min';

  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${last};${first};;;`,
    `FN:${name}`,
    `EMAIL;TYPE=INTERNET,PREF:${email}`,
    phone ? `TEL;TYPE=CELL:${phone}` : '',
    `ADR;TYPE=WORK:;;${location};;;;`,
    `URL:${calendly}`,
    `item1.URL:${linkedin}`,
    'item1.X-ABLabel:LinkedIn',
    'END:VCARD'
  ].filter(Boolean).join('\r\n');

  const res = new NextResponse(vcard, {
    headers: {
      // Correct MIME so iOS/Android recognize it:
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'attachment; filename="Sarthak-Mittal.vcf"',
      'Cache-Control': 'public, max-age=3600'
    }
  });
  return res;
}
