const mapDiv = document.getElementById("mapDiv");
const map = new ol.Map({
    target: mapDiv,
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM(),
        }),
    ],
    view: new ol.View({
        center: [0, 0],
        zoom: 2,
    }),
});
