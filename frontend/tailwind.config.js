/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
            },
            colors: {
                bg: '#050510',
                'truth-start': '#4facfe',
                'truth-end': '#00f2fe',
                'dare-start': '#f093fb',
                'dare-end': '#f5576c',
            },
            backgroundImage: {
                'main-gradient': 'radial-gradient(circle at 10% 20%, rgba(79, 172, 254, 0.1) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(245, 87, 108, 0.1) 0%, transparent 40%)',
                'truth-gradient': 'linear-gradient(135deg, #4facfe, #00f2fe)',
                'dare-gradient': 'linear-gradient(135deg, #f093fb, #f5576c)',
            },
            boxShadow: {
                'glass': '0 20px 50px rgba(0, 0, 0, 0.3)',
            }
        },
    },
    plugins: [],
}
