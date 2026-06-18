export const metadata = {
  title: 'Intro — Mark Farinas',
  robots: { index: false },
};

export default function IntroDemoPage() {
  return (
    <main className="intro-demo">
      {/* Section 1 — Name blow-out */}
      <section className="intro-section" id="intro-name">
        <div className="intro-section__content">
          <div className="intro-headline-wrap">
            <svg
              className="intro-headline"
              viewBox="0 0 900 180"
              aria-label="Mark Farinas"
            >
              <text x="50%" y="65%" dominantBaseline="middle" textAnchor="middle">
                MARK FARINAS
              </text>
            </svg>
          </div>
        </div>
      </section>

      {/* Section 2 — Tagline */}
      <section className="intro-section intro-section--dark" id="intro-tag">
        <div className="intro-section__content">
          <p className="intro-tagline">
            Computer Science <span>&times;</span> Immunology
          </p>
        </div>
      </section>

      {/* Section 3 — CS line */}
      <section className="intro-section" id="intro-cs">
        <div className="intro-section__content">
          <div className="intro-headline-wrap">
            <svg
              className="intro-headline intro-headline--sm"
              viewBox="0 0 900 120"
              aria-label="Building at the intersection"
            >
              <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle">
                BUILDING AT THE INTERSECTION
              </text>
            </svg>
          </div>
        </div>
      </section>

      {/* Section 4 — CTA landing */}
      <section className="intro-section" id="intro-cta">
        <div className="intro-section__content">
          <div className="intro-cta-block">
            <p className="intro-cta-label">Software Developer</p>
            <p className="intro-cta-location">Edmonton, Alberta</p>
            <a href="/" className="intro-cta-link">
              Enter site
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
