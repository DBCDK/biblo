Feature: Redirect after login
  The user should be directed back to the page she came from after succesful login

  Scenario: A new user should be redirected back to the first page after succesful login and profile form filling
    When mock frontpage is loaded
    And a user visits the frontpage
    And the cookiewarning has been closed
    When mock emptyUser is loaded
    And the user can log in
    When mock EntitySuggest is loaded
    And the user enters testhest into #profile-displayname-input
    And the user enters Biblioteket Godthåb into #library-searchfield
    And I click on the element .search-area--dropdown--link
    When mock ProfileSubmissionResponse is loaded
    And mock FrontpageAfterLogin is loaded
    And I click on the element .profile-form-submit-button > .rounded-button-submit
    Then wait 500 ms
    Then the path should be /



