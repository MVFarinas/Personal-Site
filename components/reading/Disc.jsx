'use client';

const SKIP = new Set(['et', 'al.', 'al', '&', 'and']);

function initials(author) {
  const letters = author
    .split(/\s+/)
    .filter((w) => !SKIP.has(w.toLowerCase()))
    .map((w) => w[0])
    .join('');
  return letters.slice(0, 2).toUpperCase();
}

export default function Disc({ entry, spinning = false, speed = 16 }) {
  const sleeved = entry.status === 'queued';

  return (
    <div className="cd-shell">
      <div
        className={`cd-disc ${spinning && !sleeved ? 'cd-disc--spinning' : ''}`}
        style={{ '--cd-speed': `${speed}s` }}
      >
        <div className="cd-label">
          <div>
            <span className="block font-serif text-black/70 text-[clamp(14px,3.4vw,20px)] leading-none">
              {initials(entry.author)}
            </span>
            <span className="block font-mono text-[8px] tracking-[0.18em] text-black/35 mt-1">
              {entry.year}
            </span>
          </div>
        </div>
      </div>

      <div className="cd-glare" />

      {sleeved && (
        <div className="cd-sleeve grid place-items-center">
          <span className="font-mono text-[8px] tracking-[0.28em] uppercase text-black/35">
            Unopened
          </span>
        </div>
      )}
    </div>
  );
}
