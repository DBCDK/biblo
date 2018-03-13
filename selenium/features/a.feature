Feature: Site Sessions
  This feature describes logging in and out of the system.

  Scenario: A new user should be redirected back to the first page after succesful login and form filling
    When mock frontpage is loaded
    And a user visits the frontpage
    And the cookiewarning has been closed
    When mock emptyUser is loaded
    And the user can log in
    When mock EntitySuggest is loaded
    And the user enters testhest into #profile-displayname-input
    And the user enters Biblioteket Godthåb into #library-searchfield
    And when I click the search-area--dropdown--link selector
    When mock ProfileSubmissionResponse is loaded
    And mock FrontpageAfterLogin is loaded
    And when I click the profile-form-submit-button > .rounded-button-submit selector
    Then wait 500 ms
    # TODO test for current url -- shpuld be '/' (frontpage)



