Feature: PreviewPage
  On this page, we can preview widgetConfigs to verify correct settings.

  Scenario: The previewPage can render a DummyWidget
    When mock frontpage is loaded
    Given a user visits the frontpage
    Given PreviewPage is loaded with widgetConfig: [{"widgetName": "DummyWidget", "widgetConfig": {}}]
    Then page is not error page
     And the page contains: This is a dummy widget

  Scenario: A DummyWidget inherits default widget props title
    When mock frontpage is loaded
    Given a user visits the frontpage
    Given PreviewPage is loaded with widgetConfig: [{"widgetName": "DummyWidget", "widgetConfig": {"title": "DETTE ER EN TEST TITEL!", "showTitle": true}}]
    Then page is not error page
     And the page contains: DETTE ER EN TEST TITEL!
