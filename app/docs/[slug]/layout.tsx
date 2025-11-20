import { Metadata } from 'next';

type Props = {
  params: { slug: string };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return {
    title: `${title} | Frigg's Gate`,
    description: `View and download the ${title} PDF document`,
    openGraph: {
      title: `${title} | Frigg's Gate`,
      description: `View and download the ${title} PDF document`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Frigg's Gate`,
      description: `View and download the ${title} PDF document`,
    },
  };
}

export default function DocsLayout({ children }: Props) {
  return <>{children}</>;
}
