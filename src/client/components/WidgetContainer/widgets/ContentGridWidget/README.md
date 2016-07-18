# ContentGridWidget

Renders a grid from an array of elements. You can have as many items as you want. Each item must contain the following:
* __id__ - {String} An id used for rendering.
* __title__ - {String} The title to display.
* __text__ - {String} Some text to display.
* __url__ - {URL} A url which each item will redirect to when clicked.
* __imageUrl__ - {URL} A url to an image to display along with the text.
* __showTitle__: {Boolean} Determines wether to display a generic title.
* __backgroundColor__: {String} What background color do you want for the widget?
* __backgroundImageUrl__: {URL} What background image do you want?

Usage: 
```javascript
{
  widgetName: 'ContentGridWidget',
  widgetConfig: {
    items: [{
      id: 1,
      title: 'bob',
      text: 'er sej'
      url: 'http://bob.er.sej.dk',
      imageUrl: 'http://bob.er.sej.dk/seje.png',
      showTitle: true,
      backgroundColor: '#FF00FF',
      backgroundImageUrl: 'http://i.imgur.com/ls2fKsP.jpg'
    }]
  }
}
```

## NB.
This widget was made for the front page and may not work elsewhere.
