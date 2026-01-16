import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { href: '#introduction', label: 'Giới thiệu' },
    { href: '#content', label: 'Nội dung' },
    { href: '#timeline', label: 'Dòng thời gian' },
    { href: '#concepts', label: 'Khái niệm' },
    { href: '#instructor', label: 'Giảng viên' },
    { href: '#game', label: 'Trò chơi' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <a href="#" className={`text-xl font-bold ${scrolled ? 'text-primary' : 'text-white'}`} style={{ fontFamily: 'var(--font-crimson-pro)' }}>
            Chủ nghĩa xã hội khoa học
          </a>
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-300 ${scrolled ? 'text-text hover:text-primary' : 'text-white hover:text-gray-200'}`}
                style={{ fontFamily: 'var(--font-atkinson)' }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;