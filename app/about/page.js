import Image from 'next/image';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import Card from '@/components/ui/Card';
import Reveal from '@/components/ui/Reveal';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f6f5f1] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader 
        title="About" 
        subtitle="Learn more about my journey, skills, and interests." 
        />

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Introduction Card */}
            <Reveal>
            <Card className="p-10">
              <h3 className="text-black text-[13px] tracking-[0.3em] font-medium uppercase mb-6">
                The Interdisciplinary Journey
              </h3>
              <div className="space-y-4">
                <p className="text-black/85 text-sm leading-relaxed font-light">
                  My name is Mark Farinas, a Computer Science student at MacEwan University with a background in Immunology from the University of Alberta. Before moving into software, I worked with complex biological systems, data, and research pipelines to tackle real-world health challenges. These experiences have shaped my analytical thinking and problem-solving skills, which I now apply to software development.
                </p>
                <p className="text-black/85 text-sm leading-relaxed font-light">
                  From studying T-cells and antibodies to working on COVID-19 research, my path has been anything but linear; but always deeply technical.
                  Today I focus on full-stack, mobile, and AI/LLM systems grounded in real-world data; most recently Schedulater, an award-winning
                  university exam-deferral platform with a RAG-grounded policy assistant, and iMapped, a Flutter trip-itinerary planner shipped to web and
                  Android and live at app.imapped.ca.
                </p>
                <p className="text-black/85 text-sm leading-relaxed font-light">
                  Currently, I&apos;m a Data Annotation Specialist for Software Engineering at Cohere, evaluating model-generated code and agent trajectories
                  as training signal for LLM development, and a Database Administrator Intern with the Alberta Federation of Rural Water Co-ops, where I built
                  a fidelity-tested Python ETL pipeline migrating a legacy Access database to a containerized PostgreSQL/NocoDB stack. I&apos;ve also delivered
                  client web infrastructure end-to-end; rebuilding and relaunching a retailer&apos;s storefront across a full DNS, TLS, and email cutover.
                </p>
              </div>
            </Card>
            </Reveal>

            {/* Education Timeline */}
            <Reveal>
            <Card className="p-10">
              <h3 className="text-black text-[13px] tracking-[0.3em] font-medium uppercase mb-8">
                Educational Path
              </h3>
              
              <div className="space-y-8">
                <div className="relative pl-6 border-l border-black/10">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 bg-black/80 rounded-full"></div>
                  <div>
                    <h4 className="text-black text-sm font-medium tracking-wider">BSc Computer Science</h4>
                    <p className="text-black/60 text-xs tracking-wider mt-1">MacEwan University • 2024 - Expected 2028</p>
                    <p className="text-black/70 text-xs mt-1">GPA: 3.6/4.0</p>
                    <p className="text-black/75 text-xs mt-3 leading-relaxed">
                      Data Structures & Algorithms, Human-Computer Interaction, Python Programming, C Programming & UNIX, Linear Algebra, Software Engineering
                    </p>
                    <div className="mt-4 space-y-1.5">
                      <p className="text-black/75 text-xs leading-relaxed">
                        <span className="font-medium">Award (Apr 2026):</span> 1st Place - CMPT 395 Software Engineering Competition (IEEE-Sponsored), with Schedulater
                      </p>
                      <p className="text-black/75 text-xs leading-relaxed">
                        <span className="font-medium">Publication (Accepted Jul 2026):</span> Co-authored paper accepted to IEEE SmartEdu 2026
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative pl-6 border-l border-black/10">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 bg-black/60 rounded-full"></div>
                  <div>
                    <h4 className="text-black text-sm font-medium tracking-wider">BSc Immunology & Infection</h4>
                    <p className="text-black/60 text-xs tracking-wider mt-1">University of Alberta • 2016 - 2021</p>
                    <p className="text-black/75 text-xs mt-3 leading-relaxed">
                      Molecular Biology, Virology, Cell Cultures, Flow Cytometry, Research Methods
                    </p>
                  </div>
                </div>
              </div>
            </Card>
            </Reveal>

            {/* Personal Interests */}
            <Reveal>
            <Card className="p-10">
              <h3 className="text-black text-[13px] tracking-[0.3em] font-medium uppercase mb-6">
                Beyond the Code
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-black text-xs tracking-[0.2em] font-medium uppercase mb-3">Health & Fitness</h4>
                  <p className="text-black/75 text-xs leading-relaxed">
                    I have developed a strong passion for fitness and nutrition. I prioritize strength training,
                    balanced nutrition, and overall wellness in my daily life as I believe a healthy body supports a sharp mind. 
                    I also indulge in playing sports such as volleyball, badminton, and basketball. 
                  </p>
                </div>
                
                <div>
                  <h4 className="text-black text-xs tracking-[0.2em] font-medium uppercase mb-3">Other Hobbies</h4>
                  <p className="text-black/75 text-xs leading-relaxed">
                    Asides from tech and fitness, I enjoy reading a variety of books ranging from mystery to science fiction to self-improvement.
                    I am also a cinephile who loves exploring different film genres and directorial styles.  
                  </p>
                </div>
              </div>
            </Card>
            </Reveal>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Portrait */}
            <Reveal>
            <Card className="p-3">
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#f6f5f1]">
                <Image
                  src="/portrait.webp"
                  alt="Mark Farinas"
                  fill
                  sizes="(max-width: 1024px) 100vw, 360px"
                  className="object-cover object-top"
                  priority
                />
              </div>
              <div className="text-center mt-3 mb-1">
                <p className="text-black/50 text-[10px] tracking-[0.3em] uppercase">
                  Mark Farinas
                </p>
              </div>

              {/* Social links - horizontal row beneath the name */}
              <div className="flex items-center justify-center gap-6 mt-4 mb-2">
                <a href="https://github.com/MVFarinas" target="_blank" rel="noopener noreferrer"
                   aria-label="GitHub" className="text-black/50 hover:text-black transition-colors">
                  <Github className="w-4 h-4" />
                </a>
                <a href="https://linkedin.com/in/MarkVincentFarinas" target="_blank" rel="noopener noreferrer"
                   aria-label="LinkedIn" className="text-black/50 hover:text-black transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://x.com/MVAFCode" target="_blank" rel="noopener noreferrer"
                   aria-label="Twitter/X" className="text-black/50 hover:text-black transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="mailto:farinasm@mymacewan.ca"
                   aria-label="Email" className="text-black/50 hover:text-black transition-colors">
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </Card>
            </Reveal>

            {/* Skills Card */}
            <Reveal>
            <Card className="p-8">
              <h3 className="text-black text-[11px] tracking-[0.3em] font-medium uppercase mb-6">
                Technical Stack
              </h3>
              
              <div className="space-y-5">
                <div>
                  <h4 className="text-black/70 text-[10px] tracking-[0.2em] uppercase mb-3">Languages</h4>
                  <div className="space-y-1">
                    {['Python', 'Kotlin', 'Dart', 'SQL', 'JavaScript', 'HTML/CSS', 'GDScript', 'C', 'VBA'].map(skill => (
                      <div key={skill} className="text-black/85 text-xs font-light">{skill}</div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-black/70 text-[10px] tracking-[0.2em] uppercase mb-3">Frameworks & Data</h4>
                  <div className="space-y-1">
                    {['Jetpack Compose', 'Flutter', 'Ktor', 'Next.js', 'React', 'FastAPI', 'PostgreSQL', 'PostGIS', 'Supabase', 'Docker'].map(skill => (
                      <div key={skill} className="text-black/85 text-xs font-light">{skill}</div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-black/70 text-[10px] tracking-[0.2em] uppercase mb-3">AI & Cloud</h4>
                  <div className="space-y-1">
                    {['Ollama', 'Groq', 'RAG pipelines', 'Whisper AI', 'Cloudflare', 'Vercel', 'Railway', 'Firebase', 'GitHub Actions'].map(skill => (
                      <div key={skill} className="text-black/85 text-xs font-light">{skill}</div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-black/70 text-[10px] tracking-[0.2em] uppercase mb-3">Lab Techniques</h4>
                  <div className="space-y-1">
                    {['PCR', 'Flow Cytometry', 'ELISA', 'Cell Culture', 'FlowJo'].map(skill => (
                      <div key={skill} className="text-black/85 text-xs font-light">{skill}</div>
                    ))}
                  </div>
                </div>
                
              
              </div>
            </Card>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}
