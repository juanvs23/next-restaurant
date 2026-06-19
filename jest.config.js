const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
  setupFiles: [],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@/public/(.*)$": "<rootDir>/public/$1",
  },
};

module.exports = createJestConfig(config);
