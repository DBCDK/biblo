Feature: Display of titleSeries

  Scenario: The Series container is showed on the books materialpages
    When mock tintin is loaded
    Given a user visits the tintin page
    And the cookiewarning has been closed
    Then the series--container > .more-info selector should contain the following items
      | Faraos cigarer | Den mystiske stjerne | 11. Bog | 13. Bog | 1. Bog | 2. Bog |
    And the .series--container > .more-info > .buttons > .show-more--button  should not be visible

  Scenario: The Series container should contain a Vis Mere button
    When mock tintin-moreseries is loaded
    Given a user visits the tintin page
    And the cookiewarning has been closed
    Then the .series--container > .more-info > .buttons > .show-more--button  should be visible

