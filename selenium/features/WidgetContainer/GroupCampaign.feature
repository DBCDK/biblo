Feature: Group Campaigns
  The group campaigns feature lets you participate in a campaign by posting content to a group.

  Scenario: Existing posts, within the campaign timeline, have a campaign logo.
    When mock campaignGroupWithContent is loaded
     And a user visits group 2
    Then page is not error page
     And the page contains a post with a campaign logo
