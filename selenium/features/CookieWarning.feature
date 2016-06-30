Feature:
  Frontpage

  Scenario: Titel på biblo.dk forsiden
    When mock frontpage is loaded
    Given a user visits the frontpage
    Then pagetitle should be Biblo
