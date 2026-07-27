/** @type {import('tailwindcss').Config} */
// Tailwind কোন কোন ফাইলে ক্লাস খুঁজবে সেটা এখানে বলা আছে।
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: { extend: {} },
  plugins: [],
};
