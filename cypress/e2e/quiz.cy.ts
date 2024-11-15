import QUESTION from "../fixtures/questions.json";

describe("Quiz Application", () => {
  context("Game Setup", () => {
    beforeEach(() => {
      // Stub the API request for starting the game
      cy.intercept("GET", "/api/questions/random", {
        statusCode: 200,
        body: QUESTION,
      }).as("getQuestions");

      // Visit the game page
      cy.visit("/");
    });

    it("should render the 'Start Quiz' button", () => {
      // Check if the button is rendered
      cy.contains("button", "Start Quiz").should("be.visible");
    });
  });

  context("Game Play", () => {
    beforeEach(() => {
      // Stub the API request for starting the game
      cy.intercept("GET", "/api/questions/random", {
        statusCode: 200,
        body: QUESTION,
      }).as("getQuestions");

      // Visit the game page
      cy.visit("/");

      // Click the "Start Quiz" button
      cy.contains("button", "Start Quiz").click();

      // Wait for the API call to complete
      cy.wait("@getQuestions").its("response.statusCode").should("eq", 200);
    });

    it("should render the first question", () => {
      // Check if the first question is rendered
      cy.contains("What is the output of print(2 ** 3)?").should("be.visible");
    });

    it("should handle answer clicks and complete Quiz with 1/1", () => {
      // Click the first answer
      cy.contains("button", "2").click();

      // Check Quiz completion
      cy.contains("Quiz Completed").should("be.visible");

      // Check the score
      cy.contains("Your score: 1/1").should("be.visible");
    });

    it("should handle answer clicks and complete Quiz with 0/1", () => {
      // Click the first answer
      cy.contains("button", "4").click();

      // Check Quiz completion
      cy.contains("Quiz Completed").should("be.visible");

      // Check the score
      cy.contains("Your score: 0/1").should("be.visible");
    });
  });

  context("Game Loading", () => {
    it("should render the loading spinner", () => {
      // Stub the API request for starting the game
      cy.intercept("GET", "/api/questions/random", {
        statusCode: 200,
        body: [],
        delay: 1000,
      }).as("getQuestions");

      // Visit the game page
      cy.visit("/");

      // Start the quiz
      cy.contains("button", "Start Quiz").click();

      // Wait for API response
      cy.wait("@getQuestions");

      // Check if the loading spinner is displayed
      cy.get(".spinner-border").should("be.visible");
    });
  });
});
