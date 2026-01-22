import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Core from './core';
import './gallery.css';
import './ui/ui.css';

const Gallery3D = () => {
  const containerRef = useRef(null);
  const coreRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize the 3D gallery
    const core = new Core();
    coreRef.current = core;
    core.render();

    // Cleanup function
    return () => {
      if (coreRef.current) {
        coreRef.current.dispose();
        coreRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="gallery-container">
      {/* Loading UI */}
      <div className="loading">
        <div className="loading-circle"></div>
        <div className="progress"></div>
      </div>

      {/* Loading Complete UI - Curtain Intro */}
      <div className="loading-complete display-none">
        {/* Curtain Left */}
        <div className="curtain curtain-left">
          <div className="curtain-inner">
            <div className="curtain-fold"></div>
            <div className="curtain-fold"></div>
            <div className="curtain-fold"></div>
          </div>
        </div>

        {/* Curtain Right */}
        <div className="curtain curtain-right">
          <div className="curtain-inner">
            <div className="curtain-fold"></div>
            <div className="curtain-fold"></div>
            <div className="curtain-fold"></div>
          </div>
        </div>

        {/* Center Content */}
        <div className="intro-content">
          <div className="intro-emblem">
            <span className="emblem-icon">☭</span>
            <div className="emblem-ring"></div>
            <div className="emblem-ring emblem-ring-2"></div>
          </div>

          <h1 className="intro-title">TRIỂN LÃM 3D</h1>
          <p className="intro-subtitle">Chủ Nghĩa Xã Hội Khoa Học</p>

          <div className="intro-divider">
            <span></span>
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <span></span>
          </div>

          <button className="start">
            <span className="btn-text">Vào Triển Lãm</span>
            <span className="btn-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </button>

          <p className="intro-tip">💡 Nhấp đôi để xem toàn màn hình</p>
        </div>

        {/* Decorative particles */}
        <div className="particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
      </div>

      {/* CSS3D Renderer */}
      <div id="css"></div>

      {/* WebGL Renderer */}
      <div id="app"></div>

      {/* Tooltip */}
      <div className="preview-tooltip hide"></div>
      {/* Xóa tip không cần thiết */}
      {/* <div className="preview-tips hide">
        Tips: Click on artwork to view details
      </div> */}

      {/* Artwork Details Dialog */}
      <div className="boards-info" style={{ visibility: 'hidden' }}>
        <div className="boards-container hide">
          <div className="close boards-info-close"></div>
          <div className="content">
            <section className="info">
              <div className="title"></div>
              <div className="author"></div>
              <div className="describe"></div>
            </section>
            <section className="img">
              <img src="" alt="" />
            </section>
          </div>
        </div>
      </div>

      {/* Help Button */}
      <div className="help">?</div>

      {/* Back Button */}
      <button
        className="back-button"
        onClick={() => navigate('/')}
        title="Back to Home"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 12H5M5 12L12 19M5 12L12 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Back</span>
      </button>

      {/* Virtual Joystick for Mobile */}
      <div id="joystick"></div>
    </div>
  );
};

export default Gallery3D;
