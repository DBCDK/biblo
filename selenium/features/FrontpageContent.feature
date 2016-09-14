Feature:
  Content from admin is loaded on the frontpage

  Scenario: A widget should be present on the frontpage
    When mock frontpage is loaded
    Given a user visits the frontpage
    Then the page contains: This is the frontpage
