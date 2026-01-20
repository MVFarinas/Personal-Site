import SectionHeader from '@/components/ui/SectionHeader';
import Card from '@/components/ui/Card';
import BulletList from '@/components/ui/BulletList';
import TechTags from '@/components/ui/TechTags';
import { experiences, technicalSkills } from '@/data/experience';

export default function ExperiencePage() {
  return (
    <div className="min-h-screen bg-[#f6f5f1] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader 
        title="Professional Experience" 
        subtitle="Work history and technical skills overview."
        />

        {/* Experience Cards */}
        <div className="grid gap-6">
          {experiences.map((exp) => (
            <Card key={exp.company} className="p-8">
              <div className="mb-4">
                <h3 className="text-black text-sm tracking-[0.15em] font-medium uppercase">{exp.title}</h3>
                <div className="flex gap-4 mt-2 text-black/60 text-xs">
                  <span className="tracking-wider">{exp.company}</span>
                  <span>·</span>
                  <span>{exp.location}</span>
                  <span>·</span>
                  <span>{exp.period}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <BulletList items={exp.responsibilities} label="Key Responsibilities" />
              </div>
              
              <TechTags tags={exp.skills} />
            </Card>
          ))}
        </div>

        {/* Technical Expertise Section */}
        <div className="mt-16">
          <h3 className="text-black text-[13px] tracking-[0.3em] font-medium uppercase mb-8">
            Technical Expertise
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h4 className="text-black/80 text-[10px] tracking-[0.2em] uppercase mb-4">Programming</h4>
              <div className="space-y-1">
                {technicalSkills.programming.map(skill => (
                  <div key={skill} className="text-black/70 text-xs">{skill}</div>
                ))}
              </div>
            </Card>
            
            <Card className="p-6">
              <h4 className="text-black/80 text-[10px] tracking-[0.2em] uppercase mb-4">Laboratory</h4>
              <div className="space-y-1">
                {technicalSkills.laboratory.map(skill => (
                  <div key={skill} className="text-black/70 text-xs">{skill}</div>
                ))}
              </div>
            </Card>
            
            <Card className="p-6">
              <h4 className="text-black/80 text-[10px] tracking-[0.2em] uppercase mb-4">Soft Skills</h4>
              <div className="space-y-1">
                {technicalSkills.soft.map(skill => (
                  <div key={skill} className="text-black/70 text-xs">{skill}</div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
