import Image from 'next/image';

interface Service {
  title: string;
  image: string;
  description: string;
}

interface ServicesCardProps {
  service: Service;
}

export default function ServicesCard({ service }: ServicesCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <Image
        src={`/images/services/${service.image}.svg`}
        alt={service.title}
        width={800}
        height={600}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
        <p className="text-gray-600">{service.description}</p>
      </div>
    </div>
  );
} 