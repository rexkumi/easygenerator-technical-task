const { defineConfig } = require('cypress');
const fs = require('fs');

module.exports = defineConfig({
	reporter: 'cypress-mochawesome-reporter',
	reporterOptions: {
		charts: true,
		html: true,
		reportPageTitle: 'Technical test report',
		embeddedScreenshots: true,
	},
	trashAssetsBeforeRuns: true,
	video: false,
	env: {
		HOME_REDIRECT_URL: 'https://www.easygenerator.com/',
		ALERT_TEXT_PATH: 'cypress/fixtures/files/alert-text.txt',
	},
	e2e: {
		setupNodeEvents(on, config) {
			on('task', {
				readFileContent(path) {
					return new Promise((resolve, reject) => {
						fs.readFile(path, 'utf8', (err, content) => {
							if (err) {
								reject(err);
							} else {
								resolve(content);
							}
						});
					});
				},
			});
			return config;
		},
		baseUrl: 'http://localhost:8080/',
		specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
		viewportHeight: 1000,
		viewportWidth: 1280,
	},
});
