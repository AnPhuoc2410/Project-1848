import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const navLinks = [
  { href: '/#introduction', label: 'Giới thiệu', type: 'home-hash' },
  { href: '/#content', label: 'Nội dung', type: 'home-hash' },
  { href: '/#timeline', label: 'Dòng thời gian', type: 'home-hash' },
  { href: '/#instructor', label: 'Giảng viên', type: 'home-hash' },
  { href: '/mirror-hall', label: 'Đại sảnh gương 3D', type: 'route' },
  { href: '/mini-game', label: 'Mini-game', type: 'route' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const containerClass = `fixed inset-x-0 top-0 z-50 transition-colors duration-300 border border-blue-300/40 bg-blue-75/90 backdrop-blur-md shadow-lg`;

  const linkColor = scrolled ? 'text-black' : 'text-black';

  return (
    <nav className={containerClass}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link
            to="/"
            className={`text-xl font-bold ${linkColor}`}
            style={{ fontFamily: 'var(--font-crimson-pro)' }}
          >
            Chủ nghĩa xã hội khoa học
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              if (link.type === 'home-hash') {
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium nav-hover-btn text-black"
                    style={{ fontFamily: 'var(--font-atkinson)' }}
                  >
                    {link.label}
                  </a>
                );
              }
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-medium nav-hover-btn text-black"
                  style={{ fontFamily: 'var(--font-atkinson)' }}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/lobby"
              className="text-sm font-semibold rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 hover:text-white transition-colors"
              style={{ fontFamily: 'var(--font-atkinson)' }}
            >
              Tới trò chơi
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
