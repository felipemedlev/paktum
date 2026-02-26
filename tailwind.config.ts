import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          DEFAULT: "var(--surface)",
          elevated: "var(--surface-elevated)",
        },
        primary: {
          DEFAULT: "#0a1628",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#0071e3",
          hover: "#0077ed",
          light: "rgba(0, 113, 227, 0.08)",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#86868b",
          foreground: "#6e6e73",
        },
        success: {
          DEFAULT: "#34c759",
          light: "rgba(52, 199, 89, 0.1)",
        },
        warning: {
          DEFAULT: "#ff9f0a",
          light: "rgba(255, 159, 10, 0.1)",
        },
        danger: {
          DEFAULT: "#ff3b30",
          light: "rgba(255, 59, 48, 0.1)",
        },
        border: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'apple-sm': '0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)',
        'apple-md': '0 4px 6px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.03)',
        'apple-lg': '0 10px 25px rgba(0,0,0,0.06), 0 4px 10px rgba(0,0,0,0.04)',
        'apple-xl': '0 20px 50px rgba(0,0,0,0.08), 0 8px 20px rgba(0,0,0,0.04)',
        'glow-blue': '0 0 20px rgba(0,113,227,0.3), 0 0 60px rgba(0,113,227,0.1)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'gradient': 'gradientMove 15s ease infinite',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        gradientMove: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
