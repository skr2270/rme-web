import { Suspense } from 'react';
import ThankYouClient from './ThankYouClient';

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-violet-800 to-violet-900" aria-label="Loading" />
      }
    >
      <ThankYouClient />
    </Suspense>
  );
}