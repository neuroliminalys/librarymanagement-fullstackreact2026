describe("Book list", () => {
  it("should display books returned by the API", () => {
    cy.intercept("GET", "http://localhost:3000/books", {
      statusCode: 200,
      body: [
        {
          id: 1,
          title: "Dune",
          author: "Frank Herbert",
          available_copies: 3,
          total_copies: 3,
        },
      ],
    }).as("getBooks");

    cy.visit("http://localhost:4200");

    cy.wait("@getBooks");

    cy.get(".book-item")
      .should("have.length.at.least", 1)
      .and("contain.text", "Dune");
  });
});
