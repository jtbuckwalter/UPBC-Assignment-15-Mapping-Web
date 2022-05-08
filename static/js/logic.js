

var quake_json = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';



// Perform a GET request to the query URL/
d3.json(quake_json).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});


const earthquakes = new L.LayerGroup();

function createFeatures(earthquakeData) {
  // function to assign colors of earthquakes based on magnitude

  //alt-color
  function circleColor(depth) {
    if (depth < 10) {
      return "#FA975E" }
    else if (depth < 30) {
      return "#FA6152"}
    else if (depth < 50) {
      return "#D11A23"}
    else if (depth < 70) {
      return "#EA009D"}
    else if (depth < 300) {
      return "#B300D6"}
    else {
      return "#6800F5"
    }}

  // function to assign size of circle based on magnitude
  function circleSize(mag) {
    return mag * 2}

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng,{
            color: "#000",
            weight: 0,
            opacity: .2,
            fillOpacity: 0.4,
            fillColor: circleColor(feature.geometry.coordinates[2]),
            radius: circleSize(feature.properties.mag)
        });
    }
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var myMap = L.map("map", {
    center: [
      0,0
    ],
    zoom: 2,
    layers: [street, earthquakes]
  });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var info = L.control({
      position: "bottomright"
  });
  // When the layer control is added, insert a div with the class of "legend"
  info.onAdd = function() {
      var div = L.DomUtil.create("div", "legend");
      div.innerHTML=[
          "<h2>Depth (km)</h2>",
          "<p><strong style=\"color:#FA975E\">Less than 10</strong></p>",
          "<p><strong style=\"color:#FA6152\">10-30</p>",
          "<p><strong style=\"color:#D11A23\">30-50</p>",
          "<p><strong style=\"color:#EA009D\">50-70</p>",
          "<p><strong style=\"color:#B300D6\">70-300</p>",
          "<p><strong style=\"color:#6800F5\">300+</p>"
      ].join("");

      return div;
  };
  // Add the info legend to the map
  info.addTo(myMap);

}
