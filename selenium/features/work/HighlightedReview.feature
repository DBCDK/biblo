Feature: Highlighted reviews on work page
  A user visits the review endpoint and is served the work page with a highlighted review.

  Scenario: A highlighted review is present on the review page
    When mock fangerneDragsholmReview is loaded
    Given A user visits review 1
    And the cookiewarning has been closed
    Then the highlight header contains Anmeldelse af Anonym

  Scenario: A user goes to a work with a bunch of reviews and should not be presented with a highlight
    When mock fangerneDragsholm is loaded
    Given a user visits material 870970-basis:05999790
    And the cookiewarning has been closed
    Then the .highlight-section should not be visible
