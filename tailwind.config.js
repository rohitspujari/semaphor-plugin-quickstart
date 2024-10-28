/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // corePlugins: {
  //   preflight: false, // this is prevent tailwind from adding base styles.
  // },
  // important: '.semaphor-custom', // scoping all tailwind styles to the semaphor-custom class. The top level div in the app must have this class to get tailwind styles to work.
  theme: {
    extend: {},
  },
  plugins: [],
};
