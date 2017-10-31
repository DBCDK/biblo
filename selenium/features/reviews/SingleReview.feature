Feature: Display of metadata related to a single review

  Scenario: Usernames that contains emojis should be displayed correctly
    When mock sixteen_top_tracks_review is loaded
    Given a user visits the reviews page with review_id 291762
    And the cookiewarning has been closed
    And the review-list--header > .reviewsCount selector should contain the following items
      | Anmeldelse af |
    Then the review-list--header > .reviewsCount > .emoji-container selector should not contain the following items
      | <img class="twemoji" |
