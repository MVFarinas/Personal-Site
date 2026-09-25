'use client';

const SERIF = 'var(--font-cormorant), Georgia, serif';

const STATUS_LABELS = {
  reading: 'Reading',
  finished: 'Finished',
  planned: 'Planned',
};

// Status is null until Mark sets it; unknown parts are left out rather than shown as blanks.
const metaParts = (item) => [item.kind, STATUS_LABELS[item.status] ?? item.status].filter(Boolean);

export default function ReadingList({ items, onSelect, visible = false }) {
  if (!visible) {
    return (
      <div className="sr-only">
        <h2>Reading list</h2>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <button type="button" onClick={() => onSelect(item.id)}>
                {[`${item.title} by ${item.author}`, ...metaParts(item)].join(', ')}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect(item.id)}
              className="w-full text-left bg-[#fffef9] border border-black/10 p-6 flex gap-4 hover:shadow-md transition-shadow duration-300 focus-visible:outline focus-visible:outline-1 focus-visible:outline-black"
            >
              <span
                aria-hidden="true"
                className="block w-3 shrink-0 self-stretch"
                style={{ backgroundColor: item.color }}
              />
              <span className="block">
                <span className="block text-xl text-black leading-tight" style={{ fontFamily: SERIF }}>
                  {item.title}
                </span>
                <span className="block text-black/60 text-xs mt-1">{item.author}</span>
                <span className="flex items-center gap-2 text-[10px] text-black/50 mt-3 uppercase tracking-[0.2em]">
                  {metaParts(item).map((part, i) => (
                    <span key={part} className="flex items-center gap-2">
                      {i > 0 && <span aria-hidden="true">·</span>}
                      <span>{part}</span>
                    </span>
                  ))}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
