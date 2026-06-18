export default function Loading() {
  return (
    <div className="min-h-screen bg-warm-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-12 h-12 rounded-full border border-gold/20 border-t-gold animate-spin" />
        <p className="font-jost text-[10px] tracking-[0.4em] uppercase text-muted">Loading</p>
      </div>
    </div>
  );
}