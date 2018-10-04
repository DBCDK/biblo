Feature: quiz widget

  Scenario: External quiz widget should be displayed
    When mock frontpage is loaded
    Given a user visits the frontpage
    Given PreviewPage is loaded with widgetConfig: [{"widgetName": "QuizWidget", "widgetConfig": {"quizId": "qweertqweert"}}]
    Then the external-quiz-wrapper selector should count 1 elements
