Feature:
  Frontpage

  Scenario: Titel på biblo.dk forsiden
    When mock frontpage is loaded
    Given at en vilkårlig bruger besøger forsiden på biblo.dk
    Then skal pagetitel være Biblo
