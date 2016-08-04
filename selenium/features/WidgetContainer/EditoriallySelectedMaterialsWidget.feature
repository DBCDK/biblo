Feature: Editorially selected materials widget
  This feature is a widget which can display materials selected from a backend.

  Scenario: The widget can load with a minimum of config
    # The previewPage requires that you're already on a page, so start by going to the frontpage.
    When mock aboutpage is loaded
    Given a user visits the aboutpage
    Then page is not error page

    # Load the relevant mock and open the preview page with a single widget configured
    When mock editoriallySelectedMaterialsWidget is loaded
    Given PreviewPage is loaded with widgetConfig: [{"widgetName": "EditoriallySelectedMaterialsWidget", "widgetConfig": {"pids":["870970-basis:25641647"], "showtitle": true}}]
    And the cookiewarning has been closed

    # Make some assertions on the response
    Then page is not error page
    And the compact-work-element selector should contain the following items
      | Astro Boy |
