/**
 * Brand tokens for Makenna Koffee.
 *
 * Matched from makennakoffee.com:
 *   - Bright tropical / beachy palette (not cozy coffee shop)
 *   - Cyan-turquoise primary with hibiscus-red and royal-blue accents
 *   - White surfaces, playful illustrations
 *   - The signature horizontal "tri-stripe" of red / royal-blue / cyan
 *
 * If the website's exact colors are tweaked later, edit the hex values here
 * and the whole portal re-skins. Tailwind reads from `tailwind.config.ts`,
 * so update both files in tandem.
 */
export const BRAND = {
  name: 'Makenna Koffee',
  domain: 'makennakoffee.com',
  colors: {
    // Cyan-turquoise — the "Makenna" wordmark color, primary brand
    primary: '#4FB8C9',
    primaryDark: '#2A95A8',
    primarySoft: '#A6E0E5',
    primaryWash: '#E5F6F8',

    // Hibiscus red — the flower in the logo, also used in tri-stripe
    hibiscus: '#C5293A',
    hibiscusDark: '#9F1F2E',
    hibiscusSoft: '#F4D5D9',

    // Royal blue — used for "KOFFEE COMPANY" wordmark and tri-stripe
    royal: '#1F5FB6',
    royalDark: '#164683',
    royalSoft: '#D8E3F3',

    // Soft accent — playful pink/magenta sprinkled across the site
    pink: '#E91E63',

    // Surfaces
    page: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceAlt: '#F8FAFC',
    cream: '#FFF8E7', // used sparingly, not the primary background

    // Status
    success: '#0F8E5C',
    warning: '#E89D2D',
    danger: '#D43A40',

    // Text
    text: '#0F1729',         // dark navy ≈ "KOFFEE COMPANY" wordmark
    textMuted: '#5A6577',
    textSubtle: '#94A0B0',
    border: '#E2E8F0',
  },
  fonts: {
    // Site uses a clean modern geometric sans for body and a bolder
    // sister for display. Poppins is the closest free Google Font match.
    sans: '"Poppins", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    display: '"Poppins", system-ui, sans-serif',
    // Brushy/script accent for the logo wordmark — site uses a custom
    // hand-lettered face. "Caveat" or "Pacifico" are decent stand-ins
    // until a custom file is dropped in /public/fonts.
    script: '"Pacifico", "Brush Script MT", cursive',
  },
  logo: {
    // Drop the real logo SVG from the site into /public/logo.svg
    src: '/logo.svg',
    text: 'Makenna',
    subtitle: 'KOFFEE COMPANY',
  },
};
