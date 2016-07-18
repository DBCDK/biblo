# LatestPostsWidget

Renders a grid (or a slider on mobile) of posts sorted by date.

Usage: 
```javascript
{
  widgetName: 'LatestPostsWidget',
  widgetConfig: {
    displayTitle: 'text to display above the widget',
    postsToLoad: 15
    groupId: 42 // The id for the group to load posts from. Optional. If not provided then latest posts across all groups are loaded.
    backgroundColor: '#ff00ff', // Optional
	backgroundImageUrl: 'http://some-host.com/url/to/image.jpeg' // Optional
  }
}
```
