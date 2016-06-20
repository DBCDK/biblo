Feature: Site Sessions
  This feature describes logging in and out of the system.

  Scenario: A user can log in, and the log out.
    Given a user visits the frontpage
    And the cookiewarning has been closed
    Then the user can log in
    And the user can log out
    And page is not error page
