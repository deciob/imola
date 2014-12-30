'use strict';

// see:
// https://www.mapbox.com/mapbox.js/example/v1.0.0/toggle-baslayers/
// https://www.mapbox.com/mapbox.js/example/v1.0.0/swipe-layers/

L.mapbox.accessToken = 'pk.eyJ1IjoiZGVjaW9iIiwiYSI6ImhuRG9vRDAifQ.mgXBdBFSOgGJaeEggvGISg';

var layerLeo,
    layerEsri,
    layerLeonardo,
    map,
    baseMaps,
    overlayMaps,
    southWest,
    northEast,
    bounds,
    leoSouthWest,
    leoNorthEast,
    leoBounds,
    range,
    CartoDB_PositronNoLabels,
    Acetate_roads;

leoSouthWest = L.latLng(44.342, 11.724),
leoNorthEast = L.latLng(44.363, 11.7),
leoBounds = L.latLngBounds(leoSouthWest, leoNorthEast);

CartoDB_PositronNoLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  minZoom: 14,
  maxZoom: 18
});

Acetate_roads = L.tileLayer('http://a{s}.acetate.geoiq.com/tiles/acetate-roads/{z}/{x}/{y}.png', {
  attribution: '&copy;2012 Esri & Stamen, Data from OSM and Natural Earth',
  subdomains: '0123',
  minZoom: 14,
  maxZoom: 18
});


layerLeo = L.mapbox.tileLayer('deciob.098d5e15');
layerEsri = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});
layerLeonardo = L.tileLayer('data/georeferenced/tiles/{z}/{x}/{y}.png', 
  {tms: true, bounds: leoBounds});

// Construct a bounding box for this map that the user cannot move out of
southWest = L.latLng(44.338, 11.669),
northEast = L.latLng(44.369, 11.752),
bounds = L.latLngBounds(southWest, northEast);

map = L.mapbox.map('map', null, 
  {maxBounds: bounds, maxZoom: 17, minZoom: 14}).setView([44.3534, 11.713], 15);

baseMaps = {
  "Aerial ESRI": layerEsri,
  "CartoDB Positron": CartoDB_PositronNoLabels,
  "OSM Leonardo inspired": layerLeo
};
overlayMaps = {
  "Map of Leonardo da Vinci": layerLeonardo,
  "Acetate Roads": Acetate_roads,
};

baseMaps['CartoDB Positron'].addTo(map);
overlayMaps['Map of Leonardo da Vinci'].addTo(map);
L.control.layers(baseMaps, overlayMaps).addTo(map);

range = document.getElementById('range');

function clip() {
  var nw = map.containerPointToLayerPoint([0, 0]),
      se = map.containerPointToLayerPoint(map.getSize()),
      clipX = nw.x + (se.x - nw.x) * range.value;
  layerLeonardo.getContainer().style.clip = 'rect(' + [nw.y, clipX, se.y, nw.x]
    .join('px,') + 'px)';
}

range['oninput' in range ? 'oninput' : 'onchange'] = clip;
map.on('move', clip);
map.on('layeradd', clip);

clip();
