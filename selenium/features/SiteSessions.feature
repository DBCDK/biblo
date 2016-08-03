Feature: Site Sessions
  This feature describes logging in and out of the system.

  Scenario: A user can log in, and the log out.
    When mock frontpage is loaded 2 times
    Given a user visits the frontpage
    And the cookiewarning has been closed
    When mock emptyUser is loaded
    Then the user can log in
    And the user can log out
    And page is not error page
    And page contains a logout warning
