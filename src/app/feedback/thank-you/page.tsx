export default function ThankYouPage() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="relative mb-4">
          <div className="flex gap-2">
            <span className="text-2xl text-yellow-500">★</span>
            <span className="text-2xl text-yellow-500">★</span>
            <span className="text-2xl text-yellow-500">★</span>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-white mb-2">Thanks for reviewing!</h2>
        <p className="text-lg text-white mb-4">Businesses grow with your insights.</p>
        <div className="w-32 h-32 bg-gray-200 rounded-xl mb-4"></div>
        <p className="text-sm text-white text-center">
          Wants to rate ANONYMOUS? <br />
          <span className="underline">PLEASE DOWNLOAD OUR APP</span>
        </p>
      </div>
    );
  }