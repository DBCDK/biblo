Feature: Content is loaded at /anmeldelser endpoint

Scenario: Lots of reviews should be present
  When mock review_explorer is loaded
  Given a user visits the review explorer page
  When the cookiewarning has been closed
  Then wait 2500 ms
  Then the page contains: 64428 ANMELDELSER
  Then the page contains: VIS FLERE

Scenario: Reviews of bibelhistorier should be present
  When mock review_explorer_bibelhistorier is loaded
  Given a user visits the review explorer page showing bibelhistorier
  When the cookiewarning has been closed
  Then wait 2500 ms
  Then the page contains: 6 ANMELDELSER
  Then the page does not contain: VIS FLERE

Scenario: When backend fails, an error message is shown
  When mock review_explorer_pid_mismatch is loaded
  Given a user visits the review explorer page
  When the cookiewarning has been closed
  Then wait 2500 ms
  Then the page contains: 0 ANMELDELSER
  Then the page does not contain: VIS FLERE
  Then the page contains: Der skete en fejl
