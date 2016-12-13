var firstPlay = true;

function loadSong() {
  let song = new buzz.sound("assets/sound/suonatore_di_liuto", {
    formats: ['mp3'],
    preload: true
  });
  song.bind('canplaythrough', function() {
    if (firstPlay) {
      this.play();
    }
    firstPlay = false;
  });
  setSoundButtonHandler(song);
}

function setSoundButtonHandler(song) {
  $( '#sound-button' ).on('click', function(e, f, g) {
    let sound_src = 'assets/sound.png';
    let mute_src = 'assets/mute.png';
    if ($( '#sound-button' ).attr('src') === sound_src) {
      $( '#sound-button' ).attr('src', mute_src);
      song.stop();
    } else {
      $( '#sound-button' ).attr('src', sound_src);
      song.play();
      song.loop();
    }
  });
}


function addMapFeatures(data) {
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
      if (feature.properties.template) {
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
    }
  });
  items.addTo(map);
}

var mapboxTiles = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnJtc2NoZWluZXIiLCJhIjoiMEJvZTZsTSJ9.iB00l7bUVL9WUxx7YwhOdA', {
  attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
});
var disableZoomParameters = {
  zoomControl: false,
  touchZoom: false,
  scrollWheelZoom: false,
  doubleClickZoom: false,
  boxZoom: false
}
var map = L.map('map', disableZoomParameters)
.addLayer(mapboxTiles)
.setView([6.550786211171341, 41.01753173828125], 9)
.on('click', function(e) {
  console.log(e.latlng.lng + ', ' + e.latlng.lat);
});

var items_promise = $.getJSON("items.json");
items_promise.then(function(items_data) {
  addMapFeatures(items_data);
  var custom_items_promise = $.getJSON("custom_items.json");
  custom_items_promise.then(function(custom_items_data) {
    addMapFeatures(custom_items_data);
    loadSong();
  });
});