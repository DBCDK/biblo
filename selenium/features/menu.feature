Feature:
  A menu should be visible

  Scenario: A main menu should be visible in the header
    When mock frontpage is loaded
    Given a user visits the frontpage
    When the cookiewarning has been closed
    Then the page contains: GRUPPER

