# BestRatedWorksWidget

This widget renders a list of the best works as determined by reviews.
The widget takes the following configuration parameters

 * __title__: {String} The title to display above the widget.
 * __size__: {Int} The amount of works to display (Optional, defaults to 50).
 * __age__: {Int} How old (in days) can the review be (Optional, defaults to 365).
 * __ratingParameter__: {Float} How important is the rating (Optional, defaults to 1).
 * __countsParameter__: {Float} How important is the amount of reviews on a work (Optional, defaults to 1).
 * __worktypes__: {Array[String]} Which worktypes should be included (Optional, defaults to all).
 * __showTitle__: {Boolean} Should the generic title be shown? (Optional, defaults to false)
 * __backgroundColor: {String} What generic background colour do you want? (Optional, defaults to inherit)
 * __backgroundImageUrl__: {String} What generic background image do you want? (Optional, defaults to inherit)

Usage: 
```javascript
{
  widgetName: 'BestRatedWorksWidget',
  widgetConfig: {
    title: 'Bob er sej!',
    size: 50,
    age: 365,
    ratingParameter: 1,
    countsParameter: 1,
    worktypes: [],
    showTitle: true,
    backgroundColor: '#FF00FF',
    backgroundImageUrl: 'http://i.imgur.com/ls2fKsP.jpg'
  }
}
```
