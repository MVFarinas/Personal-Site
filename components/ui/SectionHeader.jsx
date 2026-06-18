export default function SectionHeader({ title, subtitle, gradient = false }) {
  return (
    <div className="text-center mb-16">
      <h2 className={`text-[11px] tracking-[0.5em] font-normal uppercase mb-4 ${gradient ? 'section-header--gradient' : 'text-black'}`}>
        {title}
      </h2>
      <div className="w-16 h-px bg-black/20 mx-auto"></div>
      {subtitle && (
        <p className="text-black/60 text-xs tracking-wider mt-4">{subtitle}</p>
      )}
    </div>
  );
}
