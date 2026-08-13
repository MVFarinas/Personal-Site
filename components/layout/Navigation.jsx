'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const navItems = [
  { href: '/', label: 'home' },
  { href: '/about', label: 'about' },
  { href: '/experience', label: 'experience' },
  { href: '/research', label: 'research' },
  { href: '/projects', label: 'projects' },
  { href: '/blog', label: 'blog' },
  { href: '/contact', label: 'contact' },
];

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#f6f5f1]/98 backdrop-blur-sm border-b border-black/10">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo/Brand - Minimalist */}
          <Link 
            href="/"
            className="flex items-center gap-3 cursor-pointer group"
          >
            <span className="font-serif text-lg text-black font-normal tracking-[0.25em] uppercase">
              MF
            </span>
          </Link>

          {/* Desktop Navigation - Clean Typography */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[11px] tracking-[0.2em] uppercase transition-all duration-300 ${
                  isActive(item.href)
                    ? 'text-black font-medium' 
                    : 'text-black/60 font-normal hover:text-black'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle - Refined */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-black/70 hover:text-black transition-colors"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Menu - Clean Design */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-black/10 pt-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block w-full text-left py-2.5 text-[11px] tracking-[0.2em] uppercase transition-all duration-300 ${
                  isActive(item.href)
                    ? 'text-black font-medium pl-4' 
                    : 'text-black/60 font-normal hover:text-black hover:pl-2'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
