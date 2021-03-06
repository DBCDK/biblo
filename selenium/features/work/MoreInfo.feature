Feature: Display of metadata related to a specific material
  The More Info box is showed on materialpages displaying a selected amount of metadata related to the given material

  Scenario: The More Info box is showed on the books materialpages
    When mock peterpedal is loaded
    Given a user visits the peterpedal page
    And the cookiewarning has been closed
    Then the MoreInfo box should be present
    And the work--moreinfo > .more-info selector should contain the following items
      | Emne | Udgivet i | DK5 | Opstilling | Sprog | Omfang |

  Scenario: The More Info box is showed on the games materialpages
    When mock LegoIndianaJones is loaded
    Given a user visits the LegoIndianaJones page
    And the cookiewarning has been closed
    Then the MoreInfo box should be present
    And the more-info selector should contain the following items
      | Udgiver | Udgivet i | DK5 | Opstilling | Sprog | Alder |

  Scenario: The More Info box is showed on the movies materialpages
    When mock LegoBatmanMovie is loaded
    Given a user visits the LegoBatmanMovie page
    Then the MoreInfo box should be present
    And the more-info selector should contain the following items
      | Instruktør | Emne | Udgivet i | DK5 | Opstilling | Sprog | Tilladt for | Omfang |
