import Image from 'next/image';

export const Header: React.FC = () => {
  return (
    <div className="flex flex-col items-center mb-6 pt-4">
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="Rate My Employee Logo" width={120} height={64} priority />
      </div>
      <p className="text-xs text-gray-600 uppercase">Connecting customer to owner</p>
    </div>
  );
};