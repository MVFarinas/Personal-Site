export const projects = [
  {
    title: 'Schedulater',
    description: 'Full-stack mobile exam-deferral platform for university workflows. Won 1st Place at the IEEE-sponsored CMPT 395 Software Engineering Competition (April 2026). A research paper on its RAG-grounded policy assistant has been accepted to IEEE SmartEdu 2026.',
    tech: [
      'Kotlin',
      'Jetpack Compose',
      'Ktor',
      'JetBrains Exposed',
      'SQLite',
      'Firebase (Auth, FCM, Firestore)',
      'Ollama (Llama 3.2 3B)',
      'Docker',
      'Railway'
    ],
    github: 'https://github.com/MVFarinas',
    features: [
      'Role-based multi-tenant platform for students, faculty, and administrators',
      'JAMN Bot: RAG-grounded LLM policy assistant over MacEwan deferral policy PDFs',
      'Room-booking engine with conflict detection and proctor load-balancing',
      'Automated FCM push-notification triggers and a scheduled no-show poller',
      'Containerized backend deployed on Railway with environment-driven secrets'
    ]
  },
  {
    title: 'VocabMaxxing',
    description: 'Android vocabulary app combining a Kotlin/Ktor backend with a Groq-powered semantic scoring service and a custom algorithmic scoring engine.',
    tech: [
      'Kotlin',
      'Jetpack Compose',
      'Ktor',
      'JetBrains Exposed',
      'PostgreSQL',
      'Groq (Llama 3.3 70B)',
      'Firebase Authentication',
      'Docker',
      'Railway'
    ],
    github: 'https://github.com/MVFarinas/VocabMaxxing',
    features: [
      'Hybrid scoring: Groq Llama 3.3 70B semantic rubric + custom algorithmic engine (stemming, structural complexity, vocabulary diversity, grammar)',
      'Hardened system prompts against prompt-injection, language, and content-policy attacks',
      'Gamification mechanics: streaks, XP, and a coin shop',
      'Microphone capture and daily practice flow on the Android client'
    ]
  },
  {
    title: 'TiMED (Hack4Health 2025)',
    description: 'Hardware-software medication management system designed at Hack4Health 2025. Co-designed companion app wireframes featuring daily schedules, adherence reports, and QR-based device pairing; presented proof-of-concept to a panel of judges.',
    tech: ['Concept Design', 'Figma', 'Hardware/Software Integration', 'Healthcare UX'],
    features: [
      'Daily medication schedule with adherence reporting',
      'QR-based device pairing between phone and hardware',
      'Companion app wireframes and proof-of-concept presentation'
    ]
  },
  {
    title: 'Calorie Tracker & Planner',
    description: 'Python CLI application that reverse-engineers maintenance calories from tracked intake and weight data, models metabolic adaptation over a goal window, and solves for target intake with SciPy bounded optimization.',
    tech: ['Python', 'SciPy', 'pytest', 'Custom Data Structures', 'JSON/CSV'],
    github: 'https://github.com/MVFarinas/Calorie-Tracker-and-Planner',
    features: [
      'Reverse-engineers maintenance calories from tracked intake and weight data',
      'Models metabolic adaptation over a goal window and solves for target intake with SciPy bounded optimization',
      'Moving-average weight-trend analysis',
      'Custom linked list implementation and JSON/CSV persistence, validated by a 24-test pytest suite'
    ]
  },
  {
    title: 'Phone Menu Transcriber',
    description: 'Packaged Python transcription service that pairs Whisper speech-to-text with a locally-hosted Qwen 3 8B (Ollama) extractor to turn automated phone prompts into structured, readable menu options.',
    tech: ['Python', 'Whisper AI', 'Ollama (Qwen 3 8B)', 'Pydantic', 'FastAPI', 'mypy'],
    github: 'https://github.com/MVFarinas/Phone-Menu-Transcriber',
    features: [
      'Whisper speech-to-text feeding a locally-hosted Qwen 3 8B extractor behind a pluggable interface',
      'Schema-constrained JSON output via Pydantic, exposed as both a CLI and a FastAPI service',
      'mypy --strict typing and a 4-version CI matrix'
    ]
  },
  {
    title: 'iMapped',
    description: 'Cross-platform trip-itinerary planner that sequences day-by-day plans, optimizes routes to minimize travel time, and surfaces AI-ranked restaurants, activities, and events anchored to lodging on a map. Built as a 5-person venture team in MacEwan\'s technology-entrepreneurship course (COSL 301) and shipped to web and native Android from one codebase.',
    liveUrl: 'https://app.imapped.ca',
    tech: [
      'Flutter',
      'Dart',
      'Supabase (Postgres, PostGIS, Edge Functions)',
      'Groq (Llama 70B)',
      'OpenStreetMap / Overpass API',
      'Vercel'
    ],
    github: 'https://github.com/MVFarinas',
    features: [
      'Shipped to web and native Android from one Flutter/Dart codebase (88 Dart source files across 210 commits, 172 tests green)',
      'Client-side route optimizer in Dart — haversine distance with nearest-neighbour construction and 2-opt improvement — to sequence day-by-day plans and minimize total travel time',
      'Recommendation re-ranker on Groq (Llama 70B) as a Supabase Edge Function, caching ranked results to control response latency and API cost',
      'Integrated with Supabase (Postgres + PostGIS, PKCE auth, Edge Functions) behind repository interfaces, so seed-backed fakes could be swapped for live implementations without touching UI code',
      'Pivoted from an original flight-booking concept to itinerary planning based on two rounds of user testing and pain-point validation'
    ]
  },
  {
    title: 'Client Storefront Rebuild & Delivery',
    description: 'Rebuilt and relaunched a local retailer\'s storefront site overnight after a multi-day outage had severed its primary customer-facing channel — delivered at $0/month recurring cost with a full DNS, TLS, and email cutover.',
    tech: [
      'Cloudflare (Workers, DNS, Email Routing)',
      'GoDaddy',
      'DNS / DNSSEC',
      'TLS',
      'SPF/DKIM/DMARC',
      'Static Site (no build step)'
    ],
    features: [
      'Kept the revenue-generating online store up with zero downtime through the entire nameserver cutover: enumerated the legacy cPanel zone, verified DNSSEC state beforehand, and preserved the third-party e-commerce subdomain untouched',
      'Rebuilt the site from scratch after the only surviving artifact proved to be an unusable dev-mode SPA capture; delivered a dependency-free static site with no build step',
      'Configured TLS, Cloudflare Email Routing, and SPF/DKIM/DMARC (p=reject) so customer enquiries reach the business and its domain cannot be spoofed; added a fails-closed 18+ age gate and the privacy/terms pages the previous site never implemented',
      'Structured the handover around client ownership — client-owned domain and admin access, a portable static-file deliverable, and a written runbook — so the business can change hosts or developers without losing its storefront again'
    ]
  },
  {
    title: '2D Roguelike',
    description: 'Top-down 2D roguelike shooter built with a small team under the GitHub org NullPointer-Studios.',
    wip: true,
    tech: ['Godot 4.6', 'GDScript', 'Jolt Physics'],
    github: 'https://github.com/NullPointer-Studios/2d-roguelike',
    features: [
      'CharacterBody2D-based projectile system with travel and collision handling',
      'Three firing modes: single, burst, and shotgun',
      'Procedural terrain generation experiment using noise-based map generation'
    ]
  }
];
