describe("borrow a book", () => {
  it("borrows a book from the list and see that it has decremented (add it, borrow it, then deletes it)", () => {
    // CREATING
    cy.intercept("GET", "http://localhost:3000/books").as("booklist");
    cy.visit("http://localhost:4200");
    cy.wait("@booklist");

    cy.contains("a", "Add Book").click();
    cy.get("#title").type("Test with Cypress to borrow");
    cy.get("#author").type("Me");
    cy.get("#copies").clear().type("{upArrow} {upArrow} {upArrow}");
    cy.get("button").click();

    cy.intercept("GET", "http://localhost:3000/books").as("booklist");
    cy.wait("@booklist");
    cy.get(".book-item")
      .should("have.length.at.least", 1)
      .and("contain.text", "Test with Cypress to borrow");
    cy.get(".book-item")
      .contains("Test with Cypress to borrow")
      .parent()
      .invoke("attr", "data-cy")
      .as("bookId");

    // BORROWING
    cy.get("@bookId").then((id) => {
      cy.intercept("GET", "http://localhost:3000/books").as("booklist");
      cy.visit("http://localhost:4200");
      cy.wait("@booklist");

      cy.get(`[data-cy=book-${id.match(/\d+/)[0]}-available-copies]`)
        .invoke("text")
        .then(Number)
        .as("originalCopies");

      cy.get("@originalCopies").then((originalCopies) => {
        cy.get(`[data-cy=borrow-${id.match(/\d+/)[0]}]`).click();
        cy.get(`[data-cy=book-${id.match(/\d+/)[0]}-available-copies]`)
        .invoke("text")
        .then(Number).as("currentCopies")
        cy.get("@currentCopies").then(currentCopies => {
          if (originalCopies > 0) {
            expect(currentCopies).to.be.lessThan(originalCopies as number)
          } else {
            expect(currentCopies).to.equal(0)
          }
        })
      });
    });
    // DELETING
    cy.log("DELETING");
    cy.intercept("GET", "http://localhost:3000/books").as("booklist");
    cy.visit("http://localhost:4200");
    cy.wait("@booklist");

    cy.get("@bookId").then((id) => {
      cy.get(`[data-cy=delete-${id.match(/\d+/)[0]}]`).click();
      cy.intercept(
        "DELETE",
        `http://localhost:3000/books/${id.match(/\d+/)[0]}`,
      ).as("delete-book");
      cy.intercept("GET", "http://localhost:4200/books").as("return-booklist");
      cy.visit("http://localhost:4200/books");
      cy.wait("@return-booklist");
      cy.get(`[data-cy=book-${id.match(/\d+/)[0]}]`).should("not.exist");
    });
  });
});
