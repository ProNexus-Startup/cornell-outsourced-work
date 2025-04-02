import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import lineClamp from "@tailwindcss/line-clamp";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      width: {
        "1/7": "14.2857143%",
      },
      colors: {
        primary: "#405cfc",
        secondary: {
          DEFAULT: "#666666",
          foreground: "#FFFFFF",
        },
        success: "#00A676",
        warning: "#FFA500",
        danger: "#FF4D4D",
        "soft-blue": "#5590B4",
        "soft-blue-hover": "#4A7A99",
        "soft-red": "#E65C5C",
        "soft-red-hover": "#CC4C4C",
        "light-gray": "#E5E5E5",
        "darker-gray": "#D9D9D9",
        "table-hover": "#D1E3FC",
        "table-stripe": "#ECECEC",
        border: "#E2E8F0",
        input: "white",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "white",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInLeft: {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.3s ease-out",
        slideInLeft: "slideInLeft 0.3s ease-out",
        slideInRight: "slideInRight 0.3s ease-out",
      },
    },
  },
  plugins: [
    animate,
    lineClamp,
    function ({ addUtilities }) {
      addUtilities({
        ".letter-overflow": {
          "word-break": "break-all",
          "white-space": "normal",
        },
      });
    },
  ],
} satisfies Config;
