import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Document Preview';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const title = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1a1a',
          backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              marginBottom: '20px',
              maxWidth: '1000px',
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 32,
              color: '#a0a0a0',
              textAlign: 'center',
            }}
          >
            PDF Document
          </div>
          <div
            style={{
              fontSize: 28,
              color: '#808080',
              marginTop: '30px',
              textAlign: 'center',
            }}
          >
            Frigg&apos;s Gate
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
