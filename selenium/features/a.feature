Feature: WorkHeader

  Scenario: Title should be a link pointing to the given material
    When mock IMessisFodspor is loaded
    Given a user visits the reviews page with review_id 79285
    When the cookiewarning has been closed
    And I click on the element .work-detail--title-container > a
    Then the path should be /materiale/870970-basis:50911713
