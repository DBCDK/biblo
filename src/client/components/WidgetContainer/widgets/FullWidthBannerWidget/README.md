# FullWidthBannerWidget

Renders a full width image with text on. It requires three images, which are selected based on screen width of a given device. When the widget is clicked on, the page redirects to linkUrl.

Usage: 
```javascript
{
  widgetName: 'FullWidthBannerWidget',
  widgetConfig: {
    title: 'And yet another dummy title',
    description: 'This is a dummy banner description!',
    desktopImageUrl: 'https://this.is.a.dumme.link/dummy.desktop.png',
    tabletImageUrl: 'https://this.is.a.dumme.link/dummy.tablet.png',
    mobileImageUrl: 'https://this.is.a.dumme.link/dummy.mobile.png',
    linkUrl: 'https://this.is.a.dummy.link',
    showTitle: false,
    backgroundColor: '#FF00FF',
    backgroundImageUrl: 'http://i.imgur.com/ls2fKsP.jpg'
  }
}
```
