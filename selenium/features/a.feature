Feature: Editorially selected reviews widget
  This feature is a widget which can display reviews selected from a backend.

  Scenario: The widget can load with a minimum of config
    # The previewPage requires that you're already on a page, so start by going to the frontpage.
    When mock aboutpage is loaded
    Given a user visits the aboutpage
    Then page is not error page

    # Load the relevant mock and open the preview page with a single widget configured
    When mock editoriallySelectedReviewsWidget is loaded
    Given PreviewPage is loaded with widgetConfig: [{"widgetName": "EditoriallySelectedReviewsWidget", "widgetConfig": {"reviewIds":[3,4,5]}}]
     And the cookiewarning has been closed

    # Make some assertions on the response
    Then page is not error page
    Then Take a screenshot with filename: a.png
     And the editorial-reviews--review selector should contain the following items
       | Af: thisisthereviewauthor3 | thisisareview3 | ★ |
