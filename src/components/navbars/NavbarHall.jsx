import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NavbarHall = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const baseClasses = `text-sm font-medium transition-colors duration-300 ${scrolled ? 'text-text hover:text-primary' : 'text-white hover:text-gray-200'}`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link
            to="/mirror-hall"
            className={`text-xl font-bold ${scrolled ? 'text-primary' : 'text-white'}`}
            style={{ fontFamily: 'var(--font-crimson-pro)' }}
          >
            Đại sảnh gương 3D
          </Link>
          <div
            className="hidden md:flex items-center space-x-6"
            style={{ fontFamily: 'var(--font-atkinson)' }}
          >
            <Link to="/" className={baseClasses}>
              Khóa học
            </Link>
            <Link to="/mini-game" className={baseClasses}>
              Mini-game
            </Link>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className={baseClasses}
            >
              Game
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarHall;
