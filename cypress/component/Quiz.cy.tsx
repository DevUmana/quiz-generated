import Quiz from "../../client/src/components/Quiz";
import QUESTION from "../fixtures/questions.json";

describe("Quiz Component", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/questions/random", {
      statusCode: 200,
      body: QUESTION,
    }).as("getQuestions");
  });

  it('renders the "Start Quiz" button', () => {
    cy.mount(<Quiz />);

    // Check if the button is rendered
    cy.contains("button", "Start Quiz").should("be.visible");
  });

  it("should fetch questions and render the first question", () => {
    cy.mount(<Quiz />);

    // Click the "Start Quiz" button
    cy.contains("button", "Start Quiz").click();

    // Wait for the API call to complete
    cy.wait("@getQuestions").its("response.statusCode").should("eq", 200);

    // Check if the first question is rendered
    cy.contains("What is the output of print(2 ** 3)?").should("be.visible");
  });

  it("should handle answer clicks and complete Quiz and Passed 1/1", () => {
    cy.mount(<Quiz />);

    // Click the "Start Quiz" button
    cy.contains("button", "Start Quiz").click();

    // Wait for the API call to complete
    cy.wait("@getQuestions").its("response.statusCode").should("eq", 200);

    // Click the first answer
    cy.contains("button", "2").click();

    // Check Quiz completion
    cy.contains("Quiz Completed").should("be.visible");

    // Check the score
    cy.contains("Your score: 1/1").should("be.visible");
  });

  it("should handle answer clicks and complete Quiz and Failed 0/1", () => {
    cy.mount(<Quiz />);

    // Click the "Start Quiz" button
    cy.contains("button", "Start Quiz").click();

    // Wait for the API call to complete
    cy.wait("@getQuestions").its("response.statusCode").should("eq", 200);

    // Click the first answer
    cy.contains("button", "4").click();

    // Check Quiz completion
    cy.contains("Quiz Completed").should("be.visible");

    // Check the score
    cy.contains("Your score: 0/1").should("be.visible");
  });

  it("should handle answer clicks and take new quiz", () => {
    cy.mount(<Quiz />);

    // Click the "Start Quiz" button
    cy.contains("button", "Start Quiz").click();

    // Wait for the API call to complete
    cy.wait("@getQuestions").its("response.statusCode").should("eq", 200);

    // Click the first answer
    cy.contains("button", "2").click();

    // Check Quiz completion
    cy.contains("Quiz Completed").should("be.visible");

    // Click the "Take New Quiz" button
    cy.contains("button", "Take New Quiz").click();

    // Check if the first question is rendered
    cy.contains("What is the output of print(2 ** 3)?").should("be.visible");
  });
});

describe("Quiz Component - Loading State", () => {
  it("shows a loading label while fetching questions", () => {
    // Delay the response to simulate loading
    cy.intercept("GET", "/api/questions/random", {
      statusCode: 200,
      body: [],
    }).as("getQuestions");

    cy.mount(<Quiz />);

    // Start the quiz
    cy.contains("button", "Start Quiz").click();

    // Wait for API response
    cy.wait("@getQuestions");

    // Check if the loading spinner is displayed
    cy.get(".spinner-border").should("be.visible");
  });
});
