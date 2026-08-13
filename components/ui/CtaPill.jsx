import { ArrowUpRight } from 'lucide-react';

/**
 * Springy "blooming" call-to-action pill, adapted from jh3y's CodePen
 * (zYyzYpY) and re-skinned to the site's monochrome bone/ink palette.
 *
 * The pill blooms in on scroll via a native CSS scroll-driven animation
 * (animation-timeline: view()) with elastic `linear()` easing, and springs
 * on hover. Pure CSS - see globals.css `.cta-pill`. Degrades to a static,
 * fully-usable button without scroll-timeline support or with reduced
 * motion. Server component (just an anchor).
 */
export default function CtaPill({ href, label, external = false, Icon = ArrowUpRight }) {
  const externalProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <a className="cta-pill" href={href} {...externalProps}>
      <span className="cta-pill__bloom" aria-hidden="true"></span>
      <span className="cta-pill__label">{label}</span>
      <span className="cta-pill__icon" aria-hidden="true">
        <Icon className="w-4 h-4" />
      </span>
    </a>
  );
}
