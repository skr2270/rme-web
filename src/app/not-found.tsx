import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <Image 
            src="/logo.png" 
            alt="RateMyEmployee" 
            width={120} 
            height={60} 
            className="h-16 w-auto mx-auto" 
          />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or doesn&apos;t exist.
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/" 
            className="inline-block bg-gradient-to-r from-violet-600 to-violet-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-violet-700 hover:to-violet-800 transition-all duration-200 hover:scale-105"
          >
            Go Home
          </Link>
          <div className="text-sm text-gray-500">
            or <Link href="/login" className="text-violet-600 hover:text-violet-700 font-medium">Login</Link> to your account
          </div>
        </div>
      </div>
    </div>
  );
}
