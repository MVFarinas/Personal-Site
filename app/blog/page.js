import SectionHeader from '@/components/ui/SectionHeader';
import Card from '@/components/ui/Card';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#f6f5f1] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          title="Blog"
          subtitle="Informal write-ups on things I'm building, learning, and thinking about."
        />

        <Card className="p-10 text-center">
          <p className="text-black/70 text-xs tracking-[0.2em] uppercase">
            This page is a work in progress
          </p>
        </Card>
      </div>
    </div>
  );
}
