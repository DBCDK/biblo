Feature: Best Rated Works widget
  This widget displays a gallery of the best bibliographic works according to the review base.

  Scenario: The widget can load with a minimum of configuration
    # The previewPage requires that you're already on a page, so start by going to the frontpage.
    When mock aboutpage is loaded
    Given a user visits the aboutpage
    Then page is not error page

    # Load the relevant mock and open the preview page with a single widget configured
    When mock bestRatedWorksWidget is loaded
    Given PreviewPage is loaded with widgetConfig: [{"widgetName": "BestRatedWorksWidget", "widgetConfig": {"title": "this is a super cool way to show bibliographic works!", "size": 2, "showTitle": true}}]
      And the cookiewarning has been closed

    # Make some assertions based on what we expect.
    Then page is not error page
     And the page contains: THIS IS A SUPER COOL WAY TO SHOW BIBLIOGRAPHIC WORKS!
     And the page contains: Alle elsker Sigge
