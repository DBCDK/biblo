Feature:
  US-614: 'Det Sker' should not be visible on mobile (phone) devices'

  Scenario: 'Det Sker' should not be present in mneu
    When mock frontpage is loaded
    Given a user uses a phone
    Given a user visits the frontpage
    And the cookiewarning has been closed
    When the user clicks the menu
    Then 'Det Sker' menu item should not be visible

