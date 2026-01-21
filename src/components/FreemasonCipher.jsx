import PropTypes from 'prop-types';

/**
 * Freemason/Pigpen Cipher Symbol Component
 * Each letter A-Z maps to a unique symbol based on the classic pigpen cipher grid
 */

// Pigpen cipher mapping - each letter has a specific shape
const CIPHER_PATHS = {
  // Grid 1: No dots (A-I)
  A: { d: 'M5 5 L5 35 L35 35', dot: false }, // ⌊
  B: { d: 'M5 35 L35 35 L35 5', dot: false }, // ⌋ rotated
  C: { d: 'M5 5 L5 35 L35 35 L35 5', dot: false }, // ⊔
  D: { d: 'M5 5 L35 5 L35 35', dot: false }, // ⌐
  E: { d: 'M35 5 L5 5 L5 35', dot: false }, // ⌐ mirror
  F: { d: 'M5 5 L35 5 L35 35 L5 35', dot: false }, // ⊓
  G: { d: 'M35 5 L35 35 L5 35', dot: false }, // 」
  H: { d: 'M5 5 L5 35 L35 35', dot: false }, // 「
  I: { d: 'M5 5 L5 35 L35 35 L35 5 L5 5', dot: false }, // □

  // Grid 2: With dots (J-R)
  J: { d: 'M5 5 L5 35 L35 35', dot: true },
  K: { d: 'M5 35 L35 35 L35 5', dot: true },
  L: { d: 'M5 5 L5 35 L35 35 L35 5', dot: true },
  M: { d: 'M5 5 L35 5 L35 35', dot: true },
  N: { d: 'M35 5 L5 5 L5 35', dot: true },
  O: { d: 'M5 5 L35 5 L35 35 L5 35', dot: true },
  P: { d: 'M35 5 L35 35 L5 35', dot: true },
  Q: { d: 'M5 5 L5 35 L35 35', dot: true },
  R: { d: 'M5 5 L5 35 L35 35 L35 5 L5 5', dot: true },

  // X Grid: No dots (S-V)
  S: { d: 'M20 5 L20 35 M5 20 L20 20', dot: false, isX: true }, // ⌄ top
  T: { d: 'M20 5 L20 35 M20 20 L35 20', dot: false, isX: true }, // ⌄ right
  U: { d: 'M20 5 L20 35 M5 20 L35 20', dot: false, isX: true }, // +
  V: { d: 'M5 5 L35 35 M35 5 L20 20', dot: false, isX: true }, // X partial

  // X Grid: With dots (W-Z)
  W: { d: 'M20 5 L20 35 M5 20 L20 20', dot: true, isX: true },
  X: { d: 'M20 5 L20 35 M20 20 L35 20', dot: true, isX: true },
  Y: { d: 'M20 5 L20 35 M5 20 L35 20', dot: true, isX: true },
  Z: { d: 'M5 5 L35 35 M35 5 L5 35', dot: true, isX: true }, // Full X
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
