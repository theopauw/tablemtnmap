const OLCS_ION_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZWVhYmU0Mi1jNTZkLTQ3OGItYmUxYS00YTMyMDQyZTMwNDkiLCJpZCI6NjQ1LCJpYXQiOjE2MDYxMjE2OTF9.zQibbf5P0-moQ8KiV_K7KMtyLHbR-VlPghj8lyqWduU';
const MB_TOKEN = "pk.eyJ1IjoidGhlb3BhdXciLCJhIjoiY2xnYXc0bGwxMDBkajNqcWk5M2NvMDR0byJ9.vfpnit5GuGpF_OAjU_YlfQ";
const mapDiv = document.getElementById("mapDiv");
const mbURL = "https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=" + MB_TOKEN;
const mbTileLoader = async function (tile, src) {
    try {
        console.log("trying...");
        const response = await fetch(src, {
            referrerPolicy: "origin",
            body: JSON.stringify(data),
        });
        const result = await response.text();
        const imgData = 'data:image/png;base64,' + btoa(unescape(encodeURIComponent(result)));
        tile.getImage().src = imgData;
    } catch (error) {
        console.error("Error:", error);
    }
}
const map2d = new ol.Map({
    target: mapDiv,
    layers: [
        new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: mbURL,
            })
        }),
    ],
    view: new ol.View({
        center: [0, 0],
        zoom: 2,
    }),
});
const map3d = new olcs.OLCesium({
    map: map2d,
});
Cesium.Ion.defaultAccessToken = OLCS_ION_TOKEN;
const scene3d = map3d.getCesiumScene();
scene3d.terrainProvider = Cesium.createWorldTerrain();
map3d.setEnabled(true);
