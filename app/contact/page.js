import { Github, Linkedin, Download, Layers } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import Card from '@/components/ui/Card';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f6f5f1] pt-24 pb-16 flex items-center">
      <div className="max-w-4xl mx-auto px-6 w-full">
        <SectionHeader title="Contact" subtitle="Let's connect" />

        {/* Contact Business Card Style */}
        <Card className="p-12 mb-8">
          <div className="text-center space-y-6">
            <div>
              <div className="text-black text-[10px] tracking-[0.3em] uppercase mb-2">Email</div>
              <a 
                href="mailto:farinas@ualberta.ca"
                className="text-black/80 text-sm tracking-wider hover:text-black transition-colors"
              >
                farinas@ualberta.ca
              </a>
            </div>
            
            <div>
              <div className="text-black text-[10px] tracking-[0.3em] uppercase mb-2">Phone</div>
              <a 
                href="tel:780-802-0708"
                className="text-black/80 text-sm tracking-wider hover:text-black transition-colors"
              >
                780.802.0708
              </a>
            </div>
            
            <div>
              <div className="text-black text-[10px] tracking-[0.3em] uppercase mb-2">Location</div>
              <p className="text-black/80 text-sm tracking-wider">
                Edmonton, AB
              </p>
            </div>
          </div>
        </Card>

        {/* Social Links - Minimalist Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a 
            href="https://github.com/MVFarinas"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#fffef9] border border-black/10 p-4 text-center hover:bg-black/5 transition-all group"
          >
            <Github className="w-5 h-5 text-black/60 group-hover:text-black mx-auto mb-2" />
            <span className="text-[10px] text-black/60 tracking-wider uppercase">GitHub</span>
          </a>
          
          <a 
            href="https://linkedin.com/in/MarkVincentFarinas"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#fffef9] border border-black/10 p-4 text-center hover:bg-black/5 transition-all group"
          >
            <Linkedin className="w-5 h-5 text-black/60 group-hover:text-black mx-auto mb-2" />
            <span className="text-[10px] text-black/60 tracking-wider uppercase">LinkedIn</span>
          </a>
          
          <a 
            href="/Mark_CV_2025.pdf"
            download
            className="bg-[#fffef9] border border-black/10 p-4 text-center hover:bg-black/5 transition-all group"
          >
            <Download className="w-5 h-5 text-black/60 group-hover:text-black mx-auto mb-2" />
            <span className="text-[10px] text-black/60 tracking-wider uppercase">Resume</span>
          </a>
          
          <a 
            href="https://www.figma.com/@markfarinas"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#fffef9] border border-black/10 p-4 text-center hover:bg-black/5 transition-all group"
          >
            <Layers className="w-5 h-5 text-black/60 group-hover:text-black mx-auto mb-2" />
            <span className="text-[10px] text-black/60 tracking-wider uppercase">Figma</span>
          </a>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-12">
          <p className="text-black/50 text-[10px] tracking-[0.2em] uppercase">
            Open to opportunities in software development & bioinformatics
          </p>
        </div>
      </div>
    </div>
  );
}
