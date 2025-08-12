import { NextResponse } from 'next/server';

export async function GET() {
  const name = 'Sarthak Mittal';
  const first = 'Sarthak';
  const last = 'Mittal';
  const email = 'mittal.sart@gmail.com';
  const phone = '+91 8073877696'; // included in vCard only
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

  return new NextResponse(vcard, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'attachment; filename="Sarthak-Mittal.vcf"',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
