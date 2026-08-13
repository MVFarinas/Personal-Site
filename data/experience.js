export const experiences = [
  {
    title: 'Data Annotation Specialist, Software Engineering',
    company: 'Cohere (Independent Contractor)',
    location: 'Remote',
    period: 'August 2026 - Present',
    responsibilities: [
      'Evaluate model-generated code and multi-step agent trajectories against structured rubrics (instruction adherence, correctness, edge-case handling, security, and completeness), producing written justifications used as training signal for LLM development',
      'Debug and review AI-generated code across Python, JavaScript, Java, Go, and SQL; assess tool selection, step ordering, and error recovery in agent execution traces',
      'Selected through a multi-stage technical assessment (timed screening, annotation take-home, and interview) from a posting pool of over 1,000 applicants'
    ],
    skills: ['LLM Evaluation', 'Agent Trajectory Analysis', 'Python', 'JavaScript', 'Java', 'Go', 'SQL', 'Code Review']
  },
  {
    title: 'Database Administrator Intern',
    company: 'Alberta Federation of Rural Water Coops',
    location: 'Edmonton, AB',
    period: 'May 2026 - Present',
    responsibilities: [
      'Architected a re-runnable Python ETL pipeline (pyodbc to psycopg) migrating a legacy Microsoft Access database to a containerized PostgreSQL + NocoDB stack, validated by a 125-test fidelity suite',
      'Designed and built TimeEntrySystem, a role-based Access/VBA timesheet application with a three-stage approval workflow and a three-layer audit/integrity model for anti-fraud assurance',
      'Administrating the Water Federation website and automating standard workplace procedures, including form development and recurring administrative workflows',
      'Coordinating with stakeholders across rural Alberta water systems on data structure, access requirements, and migration rollout'
    ],
    skills: ['Python', 'SQL', 'PostgreSQL', 'VBA', 'Docker', 'NocoDB', 'MS Access', 'ETL']
  },
  {
    title: 'Lab Specialist',
    company: 'Alberta Precision Labs',
    location: 'Edmonton, AB',
    period: 'December 2022 - December 2023',
    responsibilities: [
      'Utilized PCR (qPCR and dPCR) for COVID RNA detection',
      'Prepared and conducted daily lab work',
      'Analyzed data using AbsoluteQ and Microsoft Office'
    ],
    skills: ['Digital PCR', 'RT-PCR', 'RNA Extraction', 'Data Analysis']
  },
  {
    title: 'Sales Associate',
    company: "Popeye's Supplements",
    location: 'Edmonton, AB',
    period: 'July 2022 - May 2026',
    responsibilities: [
      'Advise clients on supplements supporting athletic performance',
      'Conduct in-store demos and community engagement',
      'Educate the public on science-backed health solutions'
    ],
    skills: ['Customer Service', 'Health Education', 'Sales']
  }
];

export const technicalSkills = {
  languages: ['Python', 'Kotlin', 'Dart', 'SQL', 'JavaScript', 'HTML/CSS', 'GDScript', 'C', 'VBA'],
  frameworks: ['Jetpack Compose', 'Flutter', 'Ktor', 'JetBrains Exposed', 'Next.js', 'React', 'FastAPI', 'Retrofit'],
  databases: ['PostgreSQL', 'PostGIS', 'SQLite', 'Supabase', 'Microsoft Access', 'NocoDB', 'Docker'],
  ai: ['Ollama', 'Groq', 'RAG pipelines', 'Vector embeddings', 'Whisper AI', 'LLM evaluation', 'Agent-trajectory analysis', 'Inter-rater agreement (Cohen’s κ, Krippendorff’s α)'],
  cloud: ['Cloudflare (Workers, DNS, Email Routing)', 'Vercel', 'Railway.io', 'Firebase', 'GitHub Actions', 'DNS/TLS administration'],
  quality: ['pytest', 'mypy --strict', 'CI test matrices', 'Git', 'Figma'],
  laboratory: ['Digital PCR', 'Flow Cytometry', 'ELISA', 'Cell Culture'],
  soft: ['Problem Solving', 'Team Collaboration', 'Communication', 'Adaptability']
};
