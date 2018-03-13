Feature: Group Members Box
  Testing basic functionality of the group members box

  Scenario: Display all members
    When mock campaignGroupWithContent is loaded
    And a user visits group 2
    And the cookiewarning has been closed
    Then the group-view-members-box > .member-image selector should count 9 elements
    And I click on the element .members-button > .expand-button
    Then wait 500 ms
    Then the group-view-members-box > .member-image selector should count 22 elements
