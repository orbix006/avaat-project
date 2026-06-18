import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <span className="eyebrow block mb-4">Error 404</span>
      <h2 className="font-cormorant text-5xl md:text-7xl text-ivory mb-6">Page Not Found</h2>
      <p className="font-jost text-muted mb-8 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="gold-line mx-auto mb-8" />
      <Link href="/" className="gold-btn-outline">
        Return Home
      </Link>
    </div>
  );
}
