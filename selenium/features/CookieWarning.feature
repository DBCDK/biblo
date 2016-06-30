Feature:
  A cookie warning should be displayed to first timers

  Scenario: A cookie warning should be visible and removable
    When mock frontpage is loaded
    Given a user visits the frontpage
    Then a cookiewarning should be shown
    When the cookiewarning has been closed
    Then the cookiewarning should not be displayed
