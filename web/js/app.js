var geoserverUrl = "http://127.0.0.1:8181/geoserver";

// initialize our map
var map = L.map("map", {
  center: [-1.2836622060674874, 36.822524070739746],
  zoom: 16 //set the zoom level
});

//add openstreet map baselayer to the map
var OpenStreetMap = L.tileLayer(
  "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }
).addTo(map);

// empty geojson layer for the shortes path result
var pathLayer = L.geoJSON(null);

// draggable marker for starting point. Note the marker is initialized with an initial starting position
var sourceMarker = L.marker([-1.283147351126288, 36.822524070739746], {
  draggable: true
})
  .on("dragend", function(e) {
    Promise.all([
      getVertex(e.target.getLatLng()),
      getVertex(targetMarker.getLatLng())
    ]).then(data => {
      getRoute(data[0], data[1]);
    });
  })
  .addTo(map);

// draggbale marker for destination point.Note the marker is initialized with an initial destination positon
var targetMarker = L.marker([-1.286107765621784, 36.83449745178223], {
  draggable: true
})
  .on("dragend", function(e) {
    Promise.all([
      getVertex(sourceMarker.getLatLng()),
      getVertex(e.target.getLatLng())
    ]).then(data => {
      getRoute(data[0], data[1]);
    });
  })
  .addTo(map);

// function to get nearest vertex to the passed point
async function getVertex(selectedPoint) {
  var url = `${geoserverUrl}/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=routing:nearest_vertex&outputformat=application/json&viewparams=x:${selectedPoint.lng};y:${selectedPoint.lat};`;
  const response = await fetch(url);
  var data = await response.json();
  var features = await data.features;
  return await features[0].properties.id;
}

// function to get the shortest path from the give source and target nodes
function getRoute(source, target) {
  var url = `${geoserverUrl}/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=routing:shortest_path&outputformat=application/json&viewparams=source:${source};target:${target};`;

  fetch(url)
    .then(response => {
      return response.json();
    })
    .then(data => {
      map.removeLayer(pathLayer);
      pathLayer = L.geoJSON(data);
      map.addLayer(pathLayer);
    });
}

Promise.all([
  getVertex(sourceMarker.getLatLng()),
  getVertex(targetMarker.getLatLng())
]).then(data => {
  getRoute(data[0], data[1]);
});
