/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            "*": {
                margin: 0,
                padding: 0,
                boxSizing: "border-box",
            },
        },
    },
    plugins: [],
};
