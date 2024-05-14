//tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        foreground: "var(--foreground)",
        background: "var(--background)",
        "badge-background": "var(--badge-background)",
        "badge-foreground": "var(--badge-foreground)",
        "border-color": "var(--dropdown-border)",
      },
      screens: {
        md: "370px",
      },
    },
  },
  plugins: [],
};
