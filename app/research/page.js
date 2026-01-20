import SectionHeader from '@/components/ui/SectionHeader';
import Card from '@/components/ui/Card';
import BulletList from '@/components/ui/BulletList';
import TechTags from '@/components/ui/TechTags';
import { researchExperiences, publications } from '@/data/research';

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-[#f6f5f1] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader 
          title="Research Experience" 
          subtitle="Contributions towards scientific knowledge and innovation." 
        />

        {/* Research Timeline */}
        <div className="mb-12">
          <h3 className="text-black text-[13px] tracking-[0.3em] font-medium uppercase mb-8">
            Laboratory Experience
          </h3>
          
          <div className="space-y-6">
            {researchExperiences.map((experience) => (
              <Card key={experience.lab} className="p-8">
                <div>
                  <h4 className="text-black text-sm tracking-[0.15em] font-medium uppercase">
                    {experience.lab}
                  </h4>
                  <div className="flex gap-4 mt-2 text-black/60 text-xs">
                    <span>{experience.institution}</span>
                    <span>·</span>
                    <span>{experience.period}</span>
                  </div>
                  <p className="text-black/80 text-xs mt-3 tracking-wider">{experience.focus}</p>
                  
                  <div className="mt-6">
                    <BulletList items={experience.responsibilities} label="Contributions" />
                  </div>
                  
                  <div className="mt-6">
                    <TechTags tags={experience.techniques} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Publications Section */}
        <div>
          <h3 className="text-black text-[13px] tracking-[0.3em] font-medium uppercase mb-8">
            Publications & Presentations
          </h3>
          
          <div className="grid gap-4">
            {publications.map((pub) => (
              <Card key={pub.title} className="p-6">
                <h4 className="text-black text-xs leading-relaxed mb-2">{pub.title}</h4>
                <p className="text-black/60 text-xs">{pub.authors}</p>
                <div className="flex items-center gap-3 text-[10px] text-black/50 mt-2">
                  <span>{pub.journal || pub.venue}</span>
                  <span>·</span>
                  <span>{pub.year}</span>
                  {pub.status && (
                    <>
                      <span>·</span>
                      <span className="uppercase tracking-wider">{pub.status}</span>
                    </>
                  )}
                  {pub.location && (
                    <>
                      <span>·</span>
                      <span>{pub.location}</span>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
