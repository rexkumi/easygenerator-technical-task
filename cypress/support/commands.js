const PracticePage = require('./pageObjects/practicePage');
const practicePage = new PracticePage();

Cypress.Commands.add('openNewTab', () => {
	cy.window().then((win) => {
		cy.stub(win, 'open').as('windowOpen');
	});
});

Cypress.Commands.add('uploadFile', (fileType) => {
	const file = `cypress/fixtures/files/${fileType}`;
	practicePage.getUploadButton().selectFile(file, {
		force: true,
	});
});

Cypress.Commands.add(
	'assertCustomAlerts',
	(fieldSelector, content, buttonSelector, expectedAlertMessage) => {
		cy.task('readFileContent', content).then((fileContent) => {
			fieldSelector.type(fileContent);
			buttonSelector.click();
			cy.on('window:alert', (str) => {
				expect(str).to.equal(
					expectedAlertMessage.replace('{{content}}', fileContent)
				);
			});
		});
	}
);

Cypress.Commands.add(
	'mockedRedirect',
	(
		trigger,
		fixtureFile = 'mockedResponse.json',
		envVar = 'HOME_REDIRECT_URL',
		expectedUrl = Cypress.config('baseUrl')
	) => {
		// Load the mocked response from the specified fixture file
		cy.fixture(fixtureFile).then((mockedResponse) => {
			// Intercept the network request for the initial page load using the endpoint from the environment variable
			cy.intercept('GET', Cypress.env(envVar), (req) => {
				// Modify the request's response to mock the redirect
				req.reply(mockedResponse);
			}).as('initialRequest');

			// Call the trigger callback to perform the action that causes the redirect
			trigger();

			// Wait for the initial page load request to complete
			cy.wait('@initialRequest').then((interception) => {
				// Assert that the request has a 301 status code
				expect(interception.response.statusCode).to.equal(301);
				// Assert that the URL matches the mocked redirect URL
				cy.url().should('eq', expectedUrl);
			});
		});
	}
);
