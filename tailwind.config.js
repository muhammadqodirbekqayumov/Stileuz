/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // Disable auto dark mode based on system preference
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#ffffff",
                foreground: "#000000",
            },
            fontFamily: {
                sans: ['var(--font-sans)', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
