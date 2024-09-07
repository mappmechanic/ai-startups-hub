import { notFound } from 'next/navigation';
import { getStartupById } from '@/lib/db';
import Rating from '@/components/Rating';
import { IStartup } from '@/lib/types'; // Assuming you have a Startup type defined

const StartupDetailsPage = ({ startup }: { startup: IStartup }) => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-4">{startup.name}</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <img src={startup.logoUrl} alt={`${startup.name} logo`} className="w-full h-auto mb-4" />
        <p className="text-lg mb-2">{startup.description}</p>
        <p className="mb-2"><strong>Founded:</strong> {startup.foundedAt}</p>
        <p className="mb-2"><strong>Location:</strong> {startup.location}</p>
        <p className="mb-2"><strong>HQ Address:</strong> {startup.hqAddress}</p>
        <p className="mb-2"><strong>Website:</strong> <a href={startup.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{startup.websiteUrl}</a></p>
        <div className="mb-2">
          <strong>Rating:</strong>{' '}
          <Rating initialRating={startup.rating} id={startup.id || ''} />
        </div>
      </div>
    </div>
  </div>
);

interface StartupPageProps {
  params: {
    id: string;
  };
}

export default async function StartupPage({ params }: StartupPageProps) {
  const startup = await getStartupById(params.id);

  if (!startup) {
    notFound();
  }

  return <StartupDetailsPage startup={startup} />;
}
