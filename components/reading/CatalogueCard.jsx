'use client';

import { ExternalLink } from 'lucide-react';

const stampLabel = {
  reading: 'Checked Out',
  finished: 'Returned',
  queued: 'On Order',
};

export default function CatalogueCard({ entry }) {
  const { status, link } = entry;
  const dateLine =
    status === 'reading'
      ? `Started ${entry.started}`
      : status === 'finished'
      ? `Finished ${entry.finished}`
      : 'Date due ———';

  const Wrapper = link ? 'a' : 'div';
  const wrapperProps = link
    ? { href: link, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="catalogue-card block pl-14 pr-6 pt-5 pb-10 h-full group"
    >
      {/* Corner data, the way it is typed on a real card */}
      <div className="flex items-start justify-between gap-4 -ml-10 mb-4">
        <span className="font-mono text-[10px] tracking-[0.12em] text-black/45">
          {entry.callNumber}
        </span>
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/35">
          {entry.kind} · {entry.year}
        </span>
      </div>

      <h3 className="font-serif text-black text-xl leading-snug">
        {entry.title}
        {link && (
          <ExternalLink className="inline-block w-3 h-3 ml-2 mb-1 text-black/25 group-hover:text-black/60 transition-colors" />
        )}
      </h3>

      <p className="text-[10px] tracking-[0.2em] uppercase text-black/55 mt-2">
        {entry.author}
      </p>

      <p className="font-mono text-[10.5px] leading-[28px] text-black/65 mt-4">
        {entry.note}
      </p>

      <div className="flex items-end justify-between gap-4 mt-6">
        <div>
          <p className="text-[9px] tracking-[0.2em] uppercase text-black/40">
            {entry.subject}
          </p>
          <p className="font-mono text-[10px] text-black/40 mt-1">{dateLine}</p>
          {entry.rating && (
            <p className="font-mono text-[10px] text-black/40 mt-1">
              {'★'.repeat(entry.rating)}
              <span className="text-black/15">{'★'.repeat(5 - entry.rating)}</span>
            </p>
          )}
        </div>

        <span
          className={`catalogue-stamp ${
            status === 'queued' ? 'catalogue-stamp--faded' : ''
          }`}
        >
          {stampLabel[status]}
        </span>
      </div>
    </Wrapper>
  );
}
