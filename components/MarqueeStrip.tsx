interface MarqueeStripProps {
  items: string[];
  className?: string;
  reverse?: boolean;
}

export default function MarqueeStrip({ items, className = "", reverse = false }: MarqueeStripProps) {
  const doubled = [...items, ...items, ...items];

  return (
    <div
      className={`overflow-hidden border-y border-white/[0.08] bg-white/[0.02] py-3 ${className}`}
      aria-hidden
    >
      <div className={`flex gap-10 whitespace-nowrap w-max ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] text-white/40 flex items-center gap-10"
          >
            {item}
            <span className="text-cyan-400/60">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
