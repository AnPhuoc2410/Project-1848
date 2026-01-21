import PropTypes from 'prop-types';

/**
 * Freemason/Pigpen Cipher Symbol Component
 * Each letter A-Z maps to a unique symbol based on the classic pigpen cipher grid
 */

// Pigpen cipher mapping - each letter has a specific shape
// Grid Layout:
// A B C
// D E F
// G H I
const CIPHER_PATHS = {
  // --- Grid 1: No dots (A-I) ---
  // A: Bottom-Right corner _|
  A: { d: 'M35 5 L35 35 L5 35', dot: false },
  // B: Bottom U |_|
  B: { d: 'M5 5 L5 35 L35 35 L35 5', dot: false },
  // C: Bottom-Left corner |_
  C: { d: 'M5 5 L5 35 L35 35', dot: false },
  // D: Right bracket ]
  D: { d: 'M5 5 L35 5 L35 35 L5 35', dot: false },
  // E: Full Box []
  E: { d: 'M5 5 L35 5 L35 35 L5 35 L5 5', dot: false },
  // F: Left bracket [
  F: { d: 'M35 5 L5 5 L5 35 L35 35', dot: false },
  // G: Top-Right corner ¯|
  G: { d: 'M5 5 L35 5 L35 35', dot: false },
  // H: Top Cap (Upside down U)
  H: { d: 'M5 35 L5 5 L35 5 L35 35', dot: false },
  // I: Top-Left corner |¯
  I: { d: 'M5 35 L5 5 L35 5', dot: false },

  // --- Grid 2: With dots (J-R) ---
  // Same shapes as A-I but with dots
  J: { d: 'M35 5 L35 35 L5 35', dot: true }, // A with dot
  K: { d: 'M5 5 L5 35 L35 35 L35 5', dot: true }, // B with dot
  L: { d: 'M5 5 L5 35 L35 35', dot: true }, // C with dot
  M: { d: 'M5 5 L35 5 L35 35 L5 35', dot: true }, // D with dot
  N: { d: 'M5 5 L35 5 L35 35 L5 35 L5 5', dot: true }, // E with dot
  O: { d: 'M35 5 L5 5 L5 35 L35 35', dot: true }, // F with dot
  P: { d: 'M5 5 L35 5 L35 35', dot: true }, // G with dot
  Q: { d: 'M5 35 L5 5 L35 5 L35 35', dot: true }, // H with dot
  R: { d: 'M5 35 L5 5 L35 5', dot: true }, // I with dot

  // --- X Grid: No dots (S-V) ---
  // S: Top V shape \/
  S: { d: 'M5 5 L20 35 L35 5', dot: false, isX: true },
  // T: Right Arrow <
  T: { d: 'M5 5 L35 20 L5 35', dot: false, isX: true },
  // U: Roof ^
  U: { d: 'M35 5 L5 20 L35 35', dot: false, isX: true },
  // V: Left Arrow >
  V: { d: 'M5 35 L20 5 L35 35', dot: false, isX: true },

  // --- X Grid: With dots (W-Z) ---
  // W: Top V with dot
  W: { d: 'M5 5 L20 35 L35 5', dot: true, isX: true },
  // X: Right Arrow with dot
  X: { d: 'M5 5 L35 20 L5 35', dot: true, isX: true },
  // Y: Roof with dot
  Y: { d: 'M35 5 L5 20 L35 35', dot: true, isX: true },
  // Z: Left Arrow with dot
  Z: { d: 'M5 35 L20 5 L35 35', dot: true, isX: true },
};

export default function FreemasonCipher({
  letter,
  size = 60,
  showLetter = false,
}) {
  const upperLetter = letter?.toUpperCase();
  const cipher = CIPHER_PATHS[upperLetter];

  if (!cipher) {
    // Return empty space for non-letters (like space)
    return (
      <div
        className="freemason-symbol empty"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div className="freemason-symbol" style={{ width: size, height: size }}>
      <svg viewBox="0 0 40 40" width={size} height={size}>
        {/* Main symbol path */}
        <path
          d={cipher.d}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dot indicator for J-R and W-Z */}
        {cipher.dot && <circle cx="20" cy="20" r="4" fill="currentColor" />}
      </svg>

      {/* Optional letter label for debugging/key display */}
      {showLetter && <span className="freemason-letter">{upperLetter}</span>}
    </div>
  );
}

FreemasonCipher.propTypes = {
  letter: PropTypes.string.isRequired,
  size: PropTypes.number,
  showLetter: PropTypes.bool,
};

/**
 * Full Cipher Key Component - shows all 26 letters with their symbols
 */
export function FreemasonCipherKey({ size = 50 }) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="freemason-key">
      <h4 className="freemason-key-title">🔑 Bảng mã Freemason</h4>
      <div className="freemason-key-grid">
        {alphabet.map((letter) => (
          <div key={letter} className="freemason-key-item">
            <FreemasonCipher letter={letter} size={size} />
            <span className="freemason-key-letter">{letter}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

FreemasonCipherKey.propTypes = {
  size: PropTypes.number,
};
