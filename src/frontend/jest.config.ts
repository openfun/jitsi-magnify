import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    "^.+\\.tsx?$": `ts-jest`,
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sss|styl)$": "jest-css-modules",
  },
  testEnvironment: 'jsdom',
};

export default config;
