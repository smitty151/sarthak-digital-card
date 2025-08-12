import QRCode from 'qrcode';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const proto = (req.headers.get('x-forwarded-proto') || 'https');
  const host = req.headers.get('host') || 'localhost:3000';
  const defaultUrl = `${proto}://${host}`;

  const url = searchParams.get('url') || defaultUrl;
  const format = (searchParams.get('format') || 'png').toLowerCase();
  const sizeParam = parseInt(searchParams.get('size') || '512', 10);
  const width = Number.isFinite(sizeParam) ? Math.max(128, Math.min(sizeParam, 2048)) : 512;

  const opts: any = { width, margin: 1, color: { dark: '#0F172A', light: '#F4F1EA' } };

  if (format === 'svg') {
    const svg = await QRCode.toString(url, { ...opts, type: 'svg' });
    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  const png = await QRCode.toBuffer(url, { ...opts, type: 'png' });
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
