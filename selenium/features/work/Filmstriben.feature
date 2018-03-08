Feature: Filmstriben loan button

  Scenario: The Filmstriben loan button should contain the correct text
    When mock Fuglejagten is loaded
    Given a user visits material 870970-basis:29410895
    And the cookiewarning has been closed
    Then the work-detail--button-wrapper:nth-child(2n) selector should contain the following items
      | LÅN PÅ FILMSTRIBEN |
    And the work-detail--button-wrapper:nth-child(2n) selector should not contain the following items
      | GÅ TIL FILMSTRIBEN |
