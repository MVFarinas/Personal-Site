/**
 * Scroll-driven word-by-word text highlight.
 *
 * Each word is wrapped in a span whose brightness is animated by a
 * native CSS scroll-driven animation (animation-timeline: view()).
 * As the paragraph scrolls through the viewport, words go from dim
 * to ink in sequence. Pure CSS — no client JS — so this stays a
 * server component. Falls back to full-opacity text where
 * animation-timeline is unsupported or reduced-motion is requested.
 * See globals.css `.scroll-text`.
 */
export default function ScrollText({ children, className = '' }) {
  const words = String(children).split(/(\s+)/); // keep whitespace tokens
  const total = words.filter((w) => w.trim().length > 0).length;

  let wordIndex = -1;
  return (
    <p className={`scroll-text ${className}`} style={{ '--total': total }}>
      {words.map((token, i) => {
        if (token.trim().length === 0) return token; // preserve spacing
        wordIndex += 1;
        return (
          <span key={i} className="scroll-text__word" style={{ '--i': wordIndex }}>
            {token}
          </span>
        );
      })}
    </p>
  );
}
