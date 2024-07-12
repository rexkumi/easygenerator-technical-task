require('../../support/commands');
const PracticePage = require('../../support/pageObjects/practicePage');
const BasePage = require('../../support/pageObjects/basePage');
const { options, data, fileUploadData } = require('../../fixtures/testData');

const basePage = new BasePage();
const practicePage = new PracticePage();

describe('Easygenerator page element tests', () => {
	beforeEach(() => {
		cy.visit('/task.html');
	});

	context('Header elements', () => {
		it('redirects to a new url via the logo', () => {
			cy.mockedRedirect(() => {
				basePage.getLogo().click();
			});
		});

		it('redirects to a new url via the home button', () => {
			cy.mockedRedirect(() => {
				basePage.getHomeButton().click();
			});
		});
	});

	context('Dropdown element', () => {
		it('displays a default dropdown option', () => {
			//verify that the default dropdown option is the first option in our array
			practicePage.getDropdown().should('have.value', options[0].value);
		});

		it('displays a list of dropdown options', () => {
			practicePage.getDropdown().find('option').should('have.length', 3);
		});

		it('displays the selected dropdown option', () => {
			//cycle through our list of options and check each is displayed when selected
			options.forEach((option) => {
				practicePage.selectDropdownOption(option.value);
				practicePage.getDropdown().should('have.value', option.value);
			});
		});
	});

	context('File uploader element', () => {
		it('uploads an image file', () => {
			cy.uploadFile(fileUploadData.image);

			practicePage
				.getUploadButton()
				//verify that the value of the upload button contains the uploaded file name
				.invoke('val')
				.should('contain', fileUploadData.image);

			practicePage.getUploadedFile().should('be.visible');
		});

		it('can not upload an audio file', () => {
			//assumes user should not be able to upload a non image file (for demonstration purposes)
			cy.uploadFile(fileUploadData.audio);

			practicePage.getUploadedFile().should('not.be.visible');
		});

		it('can not upload a video file', () => {
			//assumes user should not be able to upload a non image file (for demonstration purposes)
			cy.uploadFile(fileUploadData.video);

			practicePage.getUploadedFile().should('not.be.visible');
		});

		it('can not upload a doc file', () => {
			//assumes user should not be able to upload a non image file (for demonstration purposes)
			cy.uploadFile(fileUploadData.document);

			practicePage.getUploadedFile().should('not.be.visible');
		});
	});

	context('New tab element', () => {
		it('opens up a new tab', () => {
			cy.openNewTab();

			practicePage.getOpenTabButton().click();
			//retrieve the alias from the openNewTab command
			cy.get('@windowOpen').should('be.calledOnce');
		});
	});

	context('alert/confirmation modal element', () => {
		it('can enter text into the name field', () => {
			practicePage.getNameField().type(data.nameFieldText);
			practicePage
				.getNameField()
				.should('have.value', data.nameFieldText);
		});

		it('invokes an alert', () => {
			cy.assertCustomAlerts(
				practicePage.getNameField(),
				//load the file path data from the cypress env
				Cypress.env('ALERT_TEXT_PATH'),
				practicePage.getAlertButton(),
				'Hello {{content}}, share this practice page and share your knowledge'
			);
		});

		it('invokes a confirmation model', () => {
			cy.assertCustomAlerts(
				practicePage.getNameField(),
				//load the file path data from the cypress env
				Cypress.env('ALERT_TEXT_PATH'),
				practicePage.getConfirmButton(),
				'Hello {{content}}, Are you sure you want to confirm?'
			);
		});

		it('can cancel a confirmation', () => {
			//calls the file reader task and extracts the content from our txt file
			cy.task('readFileContent', Cypress.env('ALERT_TEXT_PATH')).then(
				(content) => {
					practicePage.getNameField().type(content);
					practicePage.getAlertButton().click();
					//simulates clicking cancel on a confirmation window
					cy.on('window:confirm', () => false);
					practicePage.getNameField().should('have.value', '');
				}
			);
		});

		it('can submit a confirmation', () => {
			cy.task('readFileContent', Cypress.env('ALERT_TEXT_PATH')).then(
				(content) => {
					practicePage.getNameField().type(content);
					practicePage.getAlertButton().click();
					//simulates submitting a confirmation
					cy.on('window:confirm', () => true);
					practicePage.getNameField().should('have.value', '');
				}
			);
		});
	});

	context('hover over element', () => {
		it('displays hover content on mouse over', () => {
			//trigger a mouseover (hover) action
			practicePage.getHoverButton().trigger('mouseover');
			practicePage.getHoverContent().should('be.visible');
		});

		it('returns to the top of the page when top is selected', () => {
			//trigger a mouseover (hover) action
			practicePage.getHoverButton().trigger('mouseover');
			practicePage.getHoverOption('Top').click();
			//verifies that the page is at the top via the property scrollY
			cy.window().its('scrollY').should('equal', 0);
		});

		it('reloads the page when reload is selected', () => {
			//trigger a mouseover (hover) action
			practicePage.getHoverButton().trigger('mouseover');
			practicePage.getHoverOption('Reload').click();
			//verify that a reload occured from a button by checking the navigation entry type
			cy.window().then((win) => {
				const [navigationEntry] =
					win.performance.getEntriesByType('navigation');
				expect(navigationEntry.type).to.equal('navigate');
			});

			cy.window().its('scrollY').should('equal', 0);
		});

		it('displays the hide/show element by default', () => {
			practicePage.getHideShowElement().should('be.visible');
		});

		it('correctly hides the element via the hide button', () => {
			practicePage.getHideShowElement().then(($element) => {
				//check that the hide/show element is displayed by default first, if not the test should fail
				if ($element.is(':visible')) {
					practicePage.getHideButton().click();
					practicePage.getHideShowElement().should('not.be.visible');
				} else {
					throw new Error(data.hideShowError);
				}
			});
		});

		it('correctly shows the element', () => {
			practicePage.getHideShowElement().then(($element) => {
				//check that the hide/show element is displayed by default first, if not the test should fail
				if ($element.is(':visible')) {
					practicePage.getHideButton().click();
					practicePage.getShowButton().click();
					practicePage.getHideShowElement().should('be.visible');
				} else {
					throw new Error(data.hideShowError);
				}
			});
		});

		it('can enter text into hide show element', () => {
			practicePage.getHideShowElement().type(data.hideShowText);

			practicePage
				.getHideShowElement()
				.should('have.value', data.hideShowText);
		});
	});

	context('iframe element', () => {
		it('loads the iframe as expected', () => {
			practicePage.getIframe().should('be.visible');
		});
	});

	context('footer elements', () => {
		it('displays the facebook link', () => {
			basePage
				.getFacebookLink()
				.should(
					'have.attr',
					'href',
					'https://www.facebook.com/easygenerator/'
				);
		});

		it('displays the twitter link', () => {
			basePage
				.getTwitterLink()
				.should(
					'have.attr',
					'href',
					'https://twitter.com/easygenerator'
				);
		});

		it('displays the youtube link', () => {
			basePage
				.getYoutubeLink()
				.should(
					'have.attr',
					'href',
					'https://www.youtube.com/user/easygenerator'
				);
		});
	});
});
