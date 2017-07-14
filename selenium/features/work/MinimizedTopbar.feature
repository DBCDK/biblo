# Created by jonashyatt at 14/07/2017
Feature: Minimized top bar on work pages
  The top bar appears once you scroll past the details of the work.

  Scenario: The top bar is hidden when the details are visible
    When mock fangerneDragsholm is loaded
    Given a user visits material 870970-basis:05999790
    And the cookiewarning has been closed
    And the .work-detail--top-bar--container.present should not be visible

  Scenario: The top bar is visible when details are out of view.
    When mock fangerneDragsholm is loaded
    Given a user visits material 870970-basis:05999790
    And the cookiewarning has been closed
    Then the page is scrolled 5 times
    And wait 300 ms
    And the .work-detail--top-bar--container.present should be visible
