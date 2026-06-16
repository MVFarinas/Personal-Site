import { Github } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import Card from '@/components/ui/Card';
import BulletList from '@/components/ui/BulletList';
import TechTags from '@/components/ui/TechTags';
import Reveal from '@/components/ui/Reveal';
import { projects } from '@/data/projects';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-[#f6f5f1] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader 
          title="Projects" 
          subtitle="Building cool things that resolve real-world problems." 
        />

        {/* Projects Grid */}
        <div className="grid gap-6">
          {projects.map((project, i) => (
            <Reveal key={project.title} delay={i * 0.05}>
            <Card className="p-8" hover>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-black text-sm tracking-[0.2em] font-medium uppercase flex items-center gap-3">
                    {project.title}
                    {project.wip && (
                      <span className="text-[9px] tracking-[0.15em] text-black/50 font-normal">
                        [IN PROGRESS]
                      </span>
                    )}
                  </h3>
                  <p className="text-black/75 text-xs mt-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>
                
                {project.github && (
                  <a 
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black/50 hover:text-black transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
              </div>

              {project.features && (
                <div className="mb-4 mt-6">
                  <BulletList items={project.features} label="Key Features" />
                </div>
              )}

              {/* Tech Stack */}
              <div className="mt-6">
                <TechTags tags={project.tech} />
              </div>
            </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
