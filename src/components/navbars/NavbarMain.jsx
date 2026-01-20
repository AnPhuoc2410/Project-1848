import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NavbarMain = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#introduction', label: 'Giới thiệu', type: 'anchor' },
    { href: '#content', label: 'Nội dung', type: 'anchor' },
    { href: '#timeline', label: 'Dòng thời gian', type: 'anchor' },
    { href: '#instructor', label: 'Giảng viên', type: 'anchor' },
    { href: '/mirror-hall', label: 'Mini-game', type: 'route' },
  ];

  const baseClasses = `text-sm font-medium transition-colors duration-300 ${scrolled ? 'text-text hover:text-primary' : 'text-white hover:text-gray-200'}`;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <a href="#home" className={`text-xl font-bold ${scrolled ? 'text-primary' : 'text-white'}`} style={{ fontFamily: 'var(--font-crimson-pro)' }}>
            Chủ nghĩa xã hội khoa học
          </a>
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              if (link.type === 'route') {
                return (
                  <Link key={link.href} to={link.href} className={baseClasses} style={{ fontFamily: 'var(--font-atkinson)' }}>
                    {link.label}
                  </Link>
                );
              }
              return (
                <a key={link.href} href={link.href} className={baseClasses} style={{ fontFamily: 'var(--font-atkinson)' }}>
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarMain;
