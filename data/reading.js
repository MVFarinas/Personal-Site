// Placeholder entries - swap in the real list.
// kind:   'book' | 'article' | 'paper' | 'podcast' | 'video'
// status: 'reading' | 'finished' | 'planned'
// spine / cover: '/reading/<id>/spine.png' and '/reading/<id>/cover.png'; null uses a generated placeholder.

const placeholders = [
  { color: '#5b3a5e', textColor: '#f3e3c3', thickness: 0.33, kind: 'book', status: 'reading' },
  { color: '#1f4e5a', textColor: '#f0d9a8', thickness: 0.28, kind: 'book', status: 'finished' },
  { color: '#2f4a36', textColor: '#e9d8a6', thickness: 0.36, kind: 'book', status: 'planned' },
  { color: '#6e2a2a', textColor: '#f2e2c4', thickness: 0.22, kind: 'article', status: 'finished' },
  { color: '#23324f', textColor: '#e8cf8f', thickness: 0.31, kind: 'book', status: 'reading' },
  { color: '#b0892f', textColor: '#2a1e0f', thickness: 0.26, kind: 'paper', status: 'finished' },
  { color: '#7a5a78', textColor: '#f5e6c8', thickness: 0.35, kind: 'book', status: 'planned' },
  { color: '#3d6166', textColor: '#f1dcae', thickness: 0.24, kind: 'podcast', status: 'finished' },
  { color: '#4b3b2a', textColor: '#e6c98a', thickness: 0.29, kind: 'book', status: 'reading' },
  { color: '#8a3b32', textColor: '#f4e4c6', thickness: 0.33, kind: 'book', status: 'finished' },
  { color: '#2c5241', textColor: '#ecd6a0', thickness: 0.22, kind: 'article', status: 'planned' },
  { color: '#39405e', textColor: '#e9d2a0', thickness: 0.28, kind: 'video', status: 'finished' },
  { color: '#a07a3c', textColor: '#23180b', thickness: 0.36, kind: 'book', status: 'planned' },
  { color: '#51344f', textColor: '#f0ddb8', thickness: 0.26, kind: 'paper', status: 'reading' },
  { color: '#20464f', textColor: '#e7c983', thickness: 0.31, kind: 'book', status: 'finished' },
  { color: '#5c2530', textColor: '#f2dcbc', thickness: 0.24, kind: 'article', status: 'finished' },
  { color: '#344a2f', textColor: '#ead5a2', thickness: 0.35, kind: 'book', status: 'planned' },
  { color: '#2b2f47', textColor: '#e5c886', thickness: 0.29, kind: 'book', status: 'finished' },
  { color: '#6a4a33', textColor: '#f3dfb9', thickness: 0.22, kind: 'podcast', status: 'planned' },
  { color: '#44555e', textColor: '#f0dcae', thickness: 0.33, kind: 'book', status: 'reading' },
];

const numberWords = [
  'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty',
];

export const readingList = placeholders.map((p, i) => ({
  id: `book-${i + 1}`,
  title: `Book ${i + 1}`,
  author: `Author ${numberWords[i]}`,
  kind: p.kind,
  status: p.status,
  link: '',
  spine: null,
  cover: null,
  color: p.color,
  textColor: p.textColor,
  thickness: p.thickness,
  notes: [],
}));
