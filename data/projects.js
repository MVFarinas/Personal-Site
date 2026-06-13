export const projects = [
  {
    title: 'Schedulater',
    description: 'Full-stack mobile exam-deferral platform for university workflows. Won 1st Place at the IEEE-sponsored CMPT 395 Software Engineering Competition (April 2026). A research paper on its RAG-grounded policy assistant has been submitted to IEEE SmartEdu 2026.',
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
    description: 'Comprehensive CLI application for nutrition tracking with custom data structures and optimization algorithms.',
    tech: ['Python', 'SciPy', 'Custom Data Structures', 'JSON/CSV'],
    github: 'https://github.com/MVFarinas/Calorie-Tracker-and-Planner',
    features: [
      'SciPy non-linear optimization for maintenance-calorie estimation',
      'Personalized nutrition plans with algebraic and curve-fitted goal recommendations',
      'Moving-average weight-trend analysis',
      'Custom linked list implementation and JSON/CSV persistence'
    ]
  },
  {
    title: 'Phone Menu Transcriber',
    description: 'AI-powered tool that converts automated phone prompts into structured, readable menu options using Whisper AI.',
    tech: ['Python', 'Whisper AI', 'Audio Processing'],
    github: 'https://github.com/MVFarinas/Simple-Audio-to-Display',
    features: [
      'Automatic transcription of phone menu audio',
      'Parsing of verbalized numbers and instructions',
      'Clean, formatted output for easy navigation'
    ]
  },
  {
    title: 'COSL301 Trip Planner',
    description: 'Course startup project (COSL 301) building a trip itinerary planner that sequences day-by-day plans, optimizes routes to minimize travel time, and surfaces AI-ranked restaurants, activities, and events anchored to lodging on a map.',
    wip: true,
    tech: [
      'Flutter',
      'Supabase',
      'PostgreSQL',
      'PostGIS',
      'Groq (Llama 70B)',
      'OpenStreetMap / Overpass API',
      'TypeScript',
      'Vercel'
    ],
    features: [
      'Pivoted from an original flight-booking concept to itinerary planning based on user interviews and pain-point validation',
      'Route optimization to minimize day-to-day travel time',
      'AI-ranked recommendations for restaurants, activities, and events anchored to lodging',
      'Geo queries powered by PostGIS over a static Edmonton dataset'
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
