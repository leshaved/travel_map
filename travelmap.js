var map = L.map( 'map', {
  center: [10.0, 5.0],
  minZoom: 2,
  zoom: 2
});

var osmLayer = L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
 attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
 subdomains: ['a','b','c']
}).addTo(map);

var hereLayer = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/{type}/{mapID}/normal.day/{z}/{x}/{y}/{size}/{format}?app_id={app_id}&app_code={app_code}&lg={language}', {		
	attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
	subdomains: '1234',
	mapID: 'newest',
	app_id: 'IxfBHfHzyQ0leWeQwZiF',
	app_code: 'pJbUwzAIsav4u8-Z7IJQfg',
	base: 'base',	
	type: 'maptile',
	language: 'eng',
	format: 'png8',
	size: '256'
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
    return d > 500 ? '#A22A38' :
           d > 100  ? '#AF3946' :
           d > 29  ? '#BC4955' :
           d > 13  ? '#FC4E2A' :
           d > 6   ? '#FD8D3C' :
           d > 4   ? '#FEB24C' :
           d > 2   ? '#FED976' :
                      '#FFEDA0';
}

function country_style(feature) {
    return {
        fillColor: getColor(feature.properties.days_been_to),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

var layerCountries = L.geoJson(countries,{style: country_style});

var layerFlights = L.geoJson(flights, {
weight: 2,
opacity: 0.7,
smoothFactor: 1,
style: function (feature) {
        return {color: feature.properties.color};
    },
onEachFeature: function (feature, layer) {
layer.bindPopup(feature.properties.description);}
});

	var baseLayers = {
		"OpenStreetMap" : osmLayer,
		"Here Map": hereLayer
	};
		

	var overlays = {
		"Cities": markerClusters,
		"Countries" : layerCountries,
		"Flights": layerFlights
		
	};

L.control.layers(baseLayers,overlays).addTo(map);


