Feature: Loan button
  This feature describes the load button

  Scenario: The text on the load button should be capital letters
    When mock peterpedal is loaded
    Given a user visits the peterpedal page
    Then text on loan button should be LÅN
