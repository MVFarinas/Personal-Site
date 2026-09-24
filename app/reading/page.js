import { Suspense } from 'react';
import ReadingExperience from '@/components/reading/ReadingExperience';
import { readingList } from '@/data/reading';

export const metadata = {
  title: 'Reading - Mark Farinas',
  description: 'Books, articles, and papers I am reading, have read, and plan to read.',
};

export default function ReadingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f6f5f1]" />}>
      <ReadingExperience items={readingList} />
    </Suspense>
  );
}
