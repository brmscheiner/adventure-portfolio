


var mapboxTiles = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnJtc2NoZWluZXIiLCJhIjoiMEJvZTZsTSJ9.iB00l7bUVL9WUxx7YwhOdA', {
  attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
});
var map = L.map('map')
.addLayer(mapboxTiles)
.setView([6.550786211171341, 41.01753173828125], 9)
.on('click', function(e) {
  console.log(map.getZoom());
  console.log(e.latlng.lng + ', ' + e.latlng.lat);
});

var promise = $.getJSON("items.json");
promise.then(function(data) {
  var items = L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      let icon_path = 'assets/icons/' + feature.properties.icon;
      return L.marker(latlng,
        {
          icon: L.icon({
            iconUrl: icon_path,
            iconSize: new L.Point(64, 64)
          })
        }
      );
    },
    onEachFeature: function(feature, layer) {
      var popupOptions = {
        maxHeight: 500,
        offset: L.point(0, -30)
      };
      $.get('templates/' + feature.properties.template, function(tmpl) {
        if (feature.properties.default) {
          layer.bindPopup(tmpl, popupOptions).openPopup();
        } else {
          layer.bindPopup(tmpl, popupOptions);
        }
      });
    }
  });
  items.addTo(map);
});
//
// var song = new buzz.sound("assets/sound/suonatore_di_liuto.mp3", {
// });