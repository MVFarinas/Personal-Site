export default function BulletList({ items, label }) {
  return (
    <div>
      {label && (
        <div className="text-black/60 text-[10px] tracking-[0.2em] uppercase mb-3">
          {label}
        </div>
      )}
      <div className="space-y-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-black/40 text-xs mt-0.5">·</span>
            <span className="text-black/70 text-xs leading-relaxed">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
