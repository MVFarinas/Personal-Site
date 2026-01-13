export default function TechTags({ tags }) {
  return (
    <div className="flex flex-wrap gap-3">
      {tags.map(tag => (
        <span 
          key={tag}
          className="text-[10px] tracking-wider text-black/50 uppercase"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
