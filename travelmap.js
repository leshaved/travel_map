var map = L.map( 'map', {
  center: [15.0, 75.0],
  minZoom: 2,
  zoom: 2
});

var osmLayer = L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
 attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
 subdomains: ['a','b','c']
});

var Esri_WorldTopoMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
}).addTo(map);

var CartoDB_Positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
});

var myURL = jQuery( 'script[src$="travelmap.js"]' ).attr( 'src' ).replace( 'travelmap.js', '' );

var myIcon = L.icon({
  iconUrl: myURL + 'images/pin24.png',
  iconRetinaUrl: myURL + 'images/pin48.png',
  iconSize: [29, 24],
  iconAnchor: [9, 21],
  popupAnchor: [0, -14]
});

var markerClusters = L.markerClusterGroup();
//<br/>
for ( var i = 0; i < markers.length; ++i )
{
  var popup = markers[i].city  +
              ' in ' + markers[i].country;

  var m = L.marker( [markers[i].lat, markers[i].lng], {icon: myIcon} )
                  .bindPopup( popup );

  markerClusters.addLayer( m );
}

function getColor(d) {
    return d > 500 ? '#6D0310' :
           d > 100  ? '#811F2B' :
           d > 29  ? '#963C46' :
           d > 13  ? '#AB5962' :
           d > 6   ? '#BF767D' :
           d > 4   ? '#D49399' :
           d > 2   ? '#E9B0B4' :
                      '#FECDD0';
}

function country_style(feature) {
    return {
        fillColor: getColor(feature.properties.days_been_to),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.4
    };
}

var layerCountries = L.geoJson(countries,{
	style: country_style,
onEachFeature: function (feature, layer) {
layer.bindPopup(feature.properties.name + '. Been here for ' + feature.properties.days_been_to + ' days');} 
});

markerClusters.addTo(map);

var layerFlights = L.geoJson(flights, {
weight: 4,
opacity: 0.7,
smoothFactor: 1,
style: function (feature) {
        return {color: feature.properties.color};
    },
onEachFeature: function (feature, layer) {
layer.bindPopup(feature.properties.description )}
});

var baseLayers = {
		"Esri WorldTopoMap": Esri_WorldTopoMap,
		"OpenStreetMap" : osmLayer,		
		"CartoDB Map": CartoDB_Positron
};

var overlays = {
		"Cities": markerClusters,
		"Countries" : layerCountries,
		"Flights": layerFlights
		
};

L.control.layers(baseLayers,overlays).addTo(map);
