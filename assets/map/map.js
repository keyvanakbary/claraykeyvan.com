var Map = function(config) {
  var map;

  function toLatLong(array) {
    return {lat: array[0], lng: array[1]}
  }

  function init() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: toLatLong(config.center),
      zoom: config.zoom,
      scrollwheel: false,
      styles: config.styles
    });
  }

  function addPoint(c) {
    var icon  = new google.maps.MarkerImage(c.icon.image, null, null, null, new google.maps.Size(c.icon.width,c.icon.height));
    var marker = new google.maps.Marker({
      position: toLatLong(c.point),
      icon: icon,
      map: map,
      flat: true,
      title: ''
    });

    var BOX_WIDTH = 300;
    var BOX_HEIGHT = 120;
    var BOX_MARGIN = 10;
    var BOX_PADDING = 10;

    var box = document.createElement("div");
    box.innerHTML =
    '<div>' +
      '<div style="float: left; width: 50%; padding: ' + BOX_PADDING + 'px"><h5>' + c.title + '</h5><p>' + c.description + '</p></div>' +
      '<div style="float: left; width: 50%; height: ' + BOX_HEIGHT + 'px">' +
        '<img src="' + c.image + '" style="float: left; width: 100%"/>'
      '</div>' +
    '</div>';

    var box = new InfoBox({
      content: box,
      disableAutoPan: false,
      maxWidth: 0,
      pixelOffset: new google.maps.Size(- (BOX_WIDTH / 2), - (BOX_HEIGHT + c.icon.height + BOX_MARGIN)),
      zIndex: null,
      boxStyle: {
        opacity: 1,
        width: BOX_WIDTH + 'px',
        background: "#fff"
      },
      closeBoxMargin: BOX_PADDING + 'px',
      closeBoxURL: 'assets/images/close.svg',
      infoBoxClearance: new google.maps.Size(1, 1),
      isHidden: false,
      pane: "floatPane",
      enableEventPropagation: false
    });
    google.maps.event.addListener(marker, 'click', function() {
        box.open(map, marker);
    });
    box.open(map, marker);
  };

  init();

  return {
    addPoint: addPoint
  }
}
