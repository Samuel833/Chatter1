import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: "http://localhost:3000",
    defaultCommandTimeout: 20000, // 15 seconds
    pageLoadTimeout: 60000, 
  },
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
