import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
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
        bahnschrift: ["var(--font-bahnschrift)"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        /* Deep Navy background (#094171) */
        navy: {
          50: "hsl(207, 50%, 92%)",
          100: "hsl(207, 55%, 84%)",
          200: "hsl(207, 60%, 70%)",
          300: "hsl(207, 65%, 55%)",
          400: "hsl(207, 75%, 40%)",
          500: "hsl(207, 85%, 24%)" /* #094171 */,
          600: "hsl(207, 85%, 20%)",
          700: "hsl(207, 90%, 16%)",
          800: "hsl(207, 90%, 12%)",
          900: "hsl(207, 95%, 8%)",
          950: "hsl(207, 100%, 5%)",
        },

        /* Green for buttons and actions */
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "hsl(145, 80%, 95%)",
          100: "hsl(145, 80%, 90%)",
          200: "hsl(145, 75%, 80%)",
          300: "hsl(145, 70%, 70%)",
          400: "hsl(145, 65%, 60%)",
          500: "hsl(145, 70%, 42%)",
          600: "hsl(145, 75%, 38%)",
          700: "hsl(145, 80%, 34%)",
          800: "hsl(145, 85%, 28%)",
          900: "hsl(145, 90%, 22%)",
          950: "hsl(145, 95%, 18%)",
        },

        /* Action colors for quick access */
        action: {
          light: "hsl(145, 70%, 60%)",
          DEFAULT: "hsl(145, 70%, 42%)",
          dark: "hsl(145, 85%, 28%)",
        },

        /* Blue for secondary elements */
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: "hsl(205, 100%, 95%)",
          100: "hsl(205, 100%, 90%)",
          200: "hsl(205, 100%, 80%)",
          300: "hsl(205, 100%, 70%)",
          400: "hsl(205, 100%, 60%)",
          500: "hsl(205, 100%, 50%)",
          600: "hsl(205, 95%, 45%)",
          700: "hsl(205, 90%, 40%)",
          800: "hsl(205, 85%, 35%)",
          900: "hsl(205, 80%, 30%)",
          950: "hsl(205, 75%, 25%)",
        },

        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },

        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
