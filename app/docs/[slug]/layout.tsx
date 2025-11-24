import { Metadata } from 'next';

type Props = {
  params: { slug: string };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://friggs-gate-static-test.vercel.app';

  // Use custom image for heading-north
  const ogImage = slug === 'heading-north'
    ? `${baseUrl}/heading-north.png`
    : undefined;

  return {
    title: `${title} | Frigg's Gate`,
    description: `View and download the ${title} PDF document`,
    openGraph: {
      title: `${title} | Frigg's Gate`,
      description: `View and download the ${title} PDF document`,
      type: 'article',
      ...(ogImage && {
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Frigg's Gate`,
      description: `View and download the ${title} PDF document`,
      ...(ogImage && {
        images: [ogImage],
      }),
    },
  };
}

export default function DocsLayout({ children }: Props) {
  return <>{children}</>;
}
