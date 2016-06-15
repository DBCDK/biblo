# ContentGridWidget

Renders a grid from an array of elements. You can have as many items as you want. Each item must contain the following:
* __id__ - {String} An id used for rendering.
* __title__ - {String} The title to display.
* __text__ - {String} Some text to display.
* __url__ - {URL} A url which each item will redirect to when clicked.
* __imageUrl__ - {URL} A url to an image to display along with the text.

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
      imageUrl: 'http://bob.er.sej.dk/seje.png'
    }]
  }
}
```

## NB.
This widget was made for the front page and may not work elsewhere.
