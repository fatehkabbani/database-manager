/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
 theme: {
  extend: {

    colors: {
      foreground: 'var(--foreground)',
      primary: 'var(--primary)',
      secondary: 'var(--secondary)',
      accent: 'var(--accent)',
      muted: 'var(--muted)',
      'muted-foreground': 'var(--muted-foreground)',
      card: 'var(--card)',
      'card-foreground': 'var(--card-foreground)',
      popover: 'var(--popover)',
      'popover-foreground': 'var(--popover-foreground)',
      border: 'var(--border)',
      input: 'var(--input)',
      ring: 'var(--ring)',
      destructive: 'var(--destructive)',
      sidebar: 'var(--sidebar)',
      'sidebar-foreground': 'var(--sidebar-foreground)',
      'sidebar-primary': 'var(--sidebar-primary)',
      'sidebar-accent': 'var(--sidebar-accent)',
    },
  },
},
  plugins: [],
}
