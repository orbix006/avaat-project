"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <h2 className="font-cormorant text-4xl md:text-5xl text-gold mb-6">Something went wrong!</h2>
      <p className="font-jost text-muted mb-8 max-w-md">
        An unexpected error has occurred. We apologize for the inconvenience.
      </p>
      <button
        onClick={() => reset()}
        className="gold-btn-primary"
      >
        Try again
      </button>
    </div>
  );
}
