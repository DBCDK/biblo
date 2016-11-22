# FullWidthBannerSliderWidget

Renders an array of full width images with text on. It requires three image sizes per image,
which are selected based on screen width of a given device. When the widget is clicked on, the page redirects to the current linkUrl.

Usage:
```javascript
{
  widgetName: 'FullWidthBannerSliderWidget',
  widgetConfig: {
    title: 'Title above slider',
    showTitle: true,
    backgroundColor: '#FF00FF',
    backgroundImageUrl: 'http://i.imgur.com/ls2fKsP.jpg',
    images: [{
      id: 1, // An id to uniquely identify an image
      title: 'And yet another dummy title',
      description: 'This is a dummy banner description!',
      desktopImageUrl: 'https://this.is.a.dumme.link/dummy.desktop.png',
      tabletImageUrl: 'https://this.is.a.dumme.link/dummy.tablet.png',
      mobileImageUrl: 'https://this.is.a.dumme.link/dummy.mobile.png',
      linkUrl: 'https://this.is.a.dummy.link',
      alt: 'Image alt text',
      TTN: 5000 // TimeToNext [ms]
    }, {
      id: 2,
      title: 'A dummy title',
      description: 'This is another dummy banner description!',
      desktopImageUrl: 'https://this.is.a.dummy.link/dumme.desktop.png',
      tabletImageUrl: 'https://this.is.a.dummy.link/dumme.tablet.png',
      mobileImageUrl: 'https://this.is.a.dummy.link/dumme.mobile.png',
      linkUrl: 'https://this.is.a.dumme.link',
      alt: 'Alternative image alt text',
      TTN: 5000 // TimeToNext [ms]
    }]
  }
}
```
