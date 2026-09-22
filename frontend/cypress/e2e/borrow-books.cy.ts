describe("borrow a book", () => {
  it("adds a new book to the list", () => {
    cy.intercept("GET", "http://localhost:3000/books").as("booklist");
    cy.visit("http://localhost:4200");
    cy.wait("@booklist");

    cy.contains("a", "Add Book").click();
    cy.get("#title").type("Test with Cypress");
    cy.get("#author").type("Me");
    cy.get("#copies").clear().type("{upArrow} {upArrow} {upArrow}");
    cy.get("button").click();

    cy.intercept("GET", "http://localhost:3000/books").as("booklist");

    cy.wait("@booklist");
    cy.get(".book-item")
      .should("have.length.at.least", 1)
      .and("contain.text", "Test with Cypress");
  });
  it("borrows a book from the list and see that it has decremented", () => {
    cy.intercept("GET", "http://localhost:3000/books").as("booklist");
    cy.visit("http://localhost:4200");
    cy.wait("@booklist");

    cy.get(".book-item").get("button").contains("Borrow").click();
    cy.get(".book-item > :nth-child(3)").should("contain", "2");
  });

  it("deletes a book", () => {
    cy.intercept("GET", "http://localhost:3000/books").as("booklist");
    cy.visit("http://localhost:4200");
    cy.wait("@booklist");

    cy.get(".book-item")
    .get("button")
    .contains("Delete")
    .click()
    .should("have.length", 0)
  });
});
