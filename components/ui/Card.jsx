export default function Card({ children, className = '', hover = false }) {
  return (
    <div 
      className={`
        bg-[#fffef9] border border-black/10 
        ${hover ? 'hover:shadow-md transition-shadow duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
