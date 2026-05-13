import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    viewportWidth: 1366,
    viewportHeight: 800,
    // O front faz proxy /api/* → :8080. Aumentar timeout cobre cold-start do back local.
    requestTimeout: 10_000,
    defaultCommandTimeout: 8_000,
    video: false,
    screenshotOnRunFailure: true,
  },
});
