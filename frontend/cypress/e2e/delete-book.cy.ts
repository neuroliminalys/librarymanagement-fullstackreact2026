describe("delete a book from the booklist", () => {
  it("adds a new book to the list then deletes it", () => {
    cy.intercept("GET", "http://localhost:3000/books").as("booklist");
    cy.visit("http://localhost:4200");
    cy.wait("@booklist");

    cy.contains("a", "Add Book").click();
    cy.get("#title").type("Test with Cypress to delete");
    cy.get("#author").type("Me");
    cy.get("#copies").clear().type("{upArrow} {upArrow} {upArrow}");
    cy.get("button").click();

    cy.intercept("GET", "http://localhost:3000/books").as("booklist");

    cy.wait("@booklist");
    cy.get(".book-item")
      .should("have.length.at.least", 1)
      .and("contain.text", "Test with Cypress to delete");
    cy.get(".book-item")
      .contains("Test with Cypress to delete")
      .parent()
      .invoke("attr", "data-cy")
      .as("bookId")

    // DELETE
    cy.log("DELETING")
    cy.intercept("GET", "http://localhost:3000/books").as("booklist");
    cy.visit("http://localhost:4200");
    cy.wait("@booklist");

    // Mieux trouver le bouton delete
    cy.get("@bookId").then(id => {
      cy.get(`[data-cy=delete-${id.match(/\d+/)[0]}]`).click();
      cy.intercept("DELETE", `http://localhost:3000/books/${id.match(/\d+/)[0]}`).as("delete-book");
      cy.intercept("GET", "http://localhost:4200/books").as("return-booklist");
      cy.visit("http://localhost:4200/books");
      cy.wait("@return-booklist");
      // Ne contient pas de livre avec titre = ...
      cy.get(`[data-cy=book-${id.match(/\d+/)[0]}]`).should("not.exist")
    })
  });
});
