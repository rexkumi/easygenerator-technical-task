class BasePage {
	getLogo() {
		return cy.get('svg[viewBox="0 0 152 54"]');
	}

	getHomeButton() {
		return cy.contains('button', 'Home');
	}

	getFacebookLink() {
		return cy.contains('a', 'Facebook');
	}

	getTwitterLink() {
		return cy.contains('a', 'Twitter');
	}

	getYoutubeLink() {
		return cy.contains('a', 'Youtube');
	}
}
module.exports = BasePage;
