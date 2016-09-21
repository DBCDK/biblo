Feature: Loan button
  This feature describes the load button

  Scenario: The text on the load button should be capital letters
    When mock peterpedal is loaded
    Given a user visits the peterpedal page
    Then text on loan button should be LÅN PÅ BIBLIOTEKET

  Scenario: Work with online resources should have extra button
    When mock krigerkattene is loaded
    Given a user visits the krigerkattene page
    And the work-detail--action-buttons selector should contain the following items
      | LÅN PÅ BIBLIOTEKET | LÅN PÅ EREOLEN |
