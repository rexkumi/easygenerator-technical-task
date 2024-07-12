import BasePage from './basePage';

class PracticePage extends BasePage {
	getDropdown() {
		return cy.get('#dropdown-class-example');
	}

	selectDropdownOption(option) {
		return this.getDropdown().select(option);
	}

	getUploadButton() {
		return cy.get('input[name="img"]');
	}

	getUploadedFile() {
		return cy.get('img[src*="blob:"]');
	}

	getOpenTabButton() {
		return cy.get('#opentab');
	}

	getNameField() {
		return cy.get('#name');
	}

	getAlertButton() {
		return cy.get('#alertbtn');
	}

	getConfirmButton() {
		return cy.get('#confirmbtn');
	}

	getHideButton() {
		return cy.get('#hide-textbox');
	}

	getShowButton() {
		return cy.get('#show-textbox');
	}

	getHideShowElement() {
		return cy.get('#displayed-text');
	}

	getHoverButton() {
		return cy.get('.hover-container');
	}

	getHoverContent() {
		return cy.get('.hover-content');
	}

	getHoverOption(option) {
		return this.getHoverContent().contains('a', option);
	}

	getIframe() {
		return cy.get('#courses-iframe');
	}
}
module.exports = PracticePage;
