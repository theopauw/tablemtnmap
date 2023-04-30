const OLCS_ION_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZWVhYmU0Mi1jNTZkLTQ3OGItYmUxYS00YTMyMDQyZTMwNDkiLCJpZCI6NjQ1LCJpYXQiOjE2MDYxMjE2OTF9.zQibbf5P0-moQ8KiV_K7KMtyLHbR-VlPghj8lyqWduU';
const MB_TOKEN = "pk.eyJ1IjoidGhlb3BhdXciLCJhIjoiY2xnYXc0bGwxMDBkajNqcWk5M2NvMDR0byJ9.vfpnit5GuGpF_OAjU_YlfQ";
const mapDiv = document.getElementById("mapDiv");
const mbURL = "https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=" + MB_TOKEN;
function getStyle(){
    const fill = new ol.style.Fill({
        color: 'rgba(255,255,255,0.4)',
    });
    const stroke = new ol.style.Stroke({
        color: '#3399CC',
        width: 1.25,
    });
    const styles = //[
        new ol.style.Style({
            image: new ol.style.Circle({
                fill: fill,
                stroke: stroke,
                radius: 5,
            }),
            fill: fill,
            stroke: stroke,
        })//,
    //];
    return styles;
}
const pathTilesSource = new ol.source.VectorTile({
    //url: "/cgi-bin/mapserv?map=PATHTILES&mode=tile&tilemode=gmap&tile={x}+{y}+{z}&layers=all&map.imagetype=mvt",
    url: "/cgi-bin/mapserv?map=/usr/share/mapserver/pathtiles.map&mode=tile&tilemode=gmap&tile={x}+{y}+{z}&layers=all&map.imagetype=mvt",
    format: new ol.format.MVT(),
});
//this line is NB, else cesium doesn not load the vectortile layer
pathTilesSource.set('olcs_skip', false);
//doesn't look like this has been implemented unfortunately
//https://github.com/openlayers/ol-cesium/blob/master/src/olcs/MVTImageryProvider.js
pathTilesSource.set('olcs_maximumLevel', 600);
const pathTilesLayer = new ol.layer.VectorTile({
    source: pathTilesSource,
    declutter: true,
    //unfortunately ol-cesium seems to ignore this
    minZoom: 14,
    style: getStyle(),
});
const map2d = new ol.Map({
    target: mapDiv,
    layers: [
        new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: mbURL,
            })
        }),
        pathTilesLayer,
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
//print the camera view to the console
scene3d.camera.moveEnd.addEventListener(function() {
    console.log("done moving");
    console.log(scene3d.camera.position);
    console.log(scene3d.camera.direction);
    console.log(scene3d.camera.up);
});
map3d.setEnabled(true);
//get the container with all the ol controls (zoom etc)
const olContainerDiv = document.querySelector(".ol-overlaycontainer-stopevent");
//ol-cesium hides the controls, put them back
//I would prefer to put this in css normally but I think ol-cesium does this programmatically
olContainerDiv.style.zIndex = 1;
//add the Cesium NavigationHelpButton to the ol controls container
const navigationHelpButtonContainer = document.createElement('div');
navigationHelpButtonContainer.className = "navigationHelpButtonControl ol-control ol-unselectable";
olContainerDiv.appendChild(navigationHelpButtonContainer);
const navigationHelpButton = new Cesium.NavigationHelpButton({
    container: navigationHelpButtonContainer
});
scene3d.camera.setView({
    destination: new Cesium.Cartesian3(
        5030765.238311895,
        1679353.4371299609,
        -3535769.679535547
    ),
    orientation : {
        direction : new Cesium.Cartesian3(
            -0.6400927011634965,
            -0.5672380547774529,
            -0.518191396232618       
        ),
        up : new Cesium.Cartesian3(
            0.595823299191946,
            0.05932013327189861,
            -0.8009217926418466
        )
    }
});
