module.exports = {
    root: true,
    env: {
      node: true,
      jest: true, // Add this line for Jest globals
    },
    extends: [
      "eslint:recommended",
      "plugin:vue/vue3-essential",
    ],
    parserOptions: {
      ecmaVersion: 2020,
    },
    rules: {
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    },
  };