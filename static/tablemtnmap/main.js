//external tokens
const OLCS_ION_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZWVhYmU0Mi1jNTZkLTQ3OGItYmUxYS00YTMyMDQyZTMwNDkiLCJpZCI6NjQ1LCJpYXQiOjE2MDYxMjE2OTF9.zQibbf5P0-moQ8KiV_K7KMtyLHbR-VlPghj8lyqWduU';
const MB_TOKEN = "pk.eyJ1IjoidGhlb3BhdXciLCJhIjoiY2xnYXc0bGwxMDBkajNqcWk5M2NvMDR0byJ9.vfpnit5GuGpF_OAjU_YlfQ";
//html elements
const mapDiv = document.getElementById("mapDiv");
const harbourRow = document.getElementById("harbourRow");
const platteklipRow = document.getElementById("platteklipRow");
const duiwelspiekRow = document.getElementById("duiwelspiekRow");
const skeletongorgeRow = document.getElementById("skeletongorgeRow");
const smutstrackRow = document.getElementById("smutstrackRow");
const kasteelpoortRow = document.getElementById("kasteelpoortRow");
const leeukopRow = document.getElementById("leeukopRow");
const wagonroadRow = document.getElementById("wagonroadRow");
const trailSelectControl = document.getElementById("trailSelectControl");
//URL's 
const mbURL = "https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=" + MB_TOKEN;
//Colours for trails
//Get from css rules for trail view control, so we only have to set it once

const trailViewControlStyle = window.getComputedStyle(trailSelectControl);
const defaultColour = trailViewControlStyle.getPropertyValue("--trail-colour-default");
const platteklipColour = trailViewControlStyle.getPropertyValue("--trail-colour-platteklip");
const duiwelspiekColour = trailViewControlStyle.getPropertyValue("--trail-colour-duiwelspiek");
const skeletongorgeColour = trailViewControlStyle.getPropertyValue("--trail-colour-skeletongorge");
const smutstrackColour = trailViewControlStyle.getPropertyValue("--trail-colour-smutstrack");
const kasteelpoortColour = trailViewControlStyle.getPropertyValue("--trail-colour-kasteelpoort");
const leeukopColour = trailViewControlStyle.getPropertyValue("--trail-colour-leeukop");
const wagonroadColour = trailViewControlStyle.getPropertyValue("--trail-colour-wagonroad");

//selected camera views
function getCesiumView(destX,destY,destZ,dirX,dirY,dirZ,upX,upY,upZ) {
    return {
        destination: new Cesium.Cartesian3(destX,destY,destZ),
        orientation : {
            direction : new Cesium.Cartesian3(dirX,dirY,dirZ),
            up : new Cesium.Cartesian3(upX,upY,upZ)
        }
    }
}
const harbourView = getCesiumView(5030765.238311895, 1679353.4371299609, -3535769.679535547, 
    -0.6400927011634965, -0.5672380547774529, -0.518191396232618, 
    0.595823299191946, 0.05932013327189861, -0.8009217926418466);
const platteklipView = getCesiumView(5025956.30572498, 1674474.426575658, -3542435.3450033944,
    -0.5014095250984244, -0.7883311432182935, -0.3565424193174091,
    0.6406062917523132, -0.06126991044776303, -0.7654211762429057);
const duiwelspiekView = getCesiumView(5026597.546253986, 1673859.1795927994, -3542073.031926558,
    -0.8611349703501268, 0.48479185780402756, -0.1530471085875382,
    0.4373196718012454, 0.5528980603147675, -0.7092638715991524);
const skeletongorgeView = getCesiumView(5023817.036166601, 1674864.0926462049, -3545553.86767674,
    -0.24704004878099267, -0.9435315169676121, 0.2207249210829662,
    0.7864223716778233, -0.32830376514334436, -0.5232174415263042);
const smutstrackView = getCesiumView(5025015.25676336, 1671784.220127667, -3545709.4398772353,
    -0.27987893141711895, 0.7316540961147578, 0.6215706455321941,
    0.7373022900681292, 0.5784728984043044, -0.3489332871366901);
const kasteelpoortView = getCesiumView(5026495.298330089, 1669067.015441502, -3544152.5146851907,
    -0.5881222423102749, 0.7936970374566055, 0.15542599793001932,
    0.6251420566183381, 0.5680454125073949, -0.535277328472165);
const leeukopView = getCesiumView(5028135.897712389, 1672538.1938156872, -3541473.1528766453,
    -0.6531000600116895, -0.7190807468972253, 0.23745144988914296,
    0.4426918041864418, -0.6169418586893489, -0.6506970950473688);
const wagonroadView = getCesiumView(5018114.208285684, 1672752.4626771307, -3554977.010723269,
    -0.4560624571851878, -0.8680017473225412, -0.19641792634895683,
    0.6483093576682983, -0.17284044833070109, -0.741499262427523);

//set up data sources and layers
const getStyle = function(thisColour, thisWidth) {
    const stroke = new ol.style.Stroke({
        color: thisColour,
        width: thisWidth,
    });
    return [
        new ol.style.Style({
            stroke: stroke,
        })
    ];
}
function getMVTSource(mapcacheLayer, thisExtent) {
    //const thisURL = "/cgi-bin/mapserv?map=" + mapFileName + "&mode=tile&tilemode=gmap&tile={x}+{y}+{z}&layers=all&map.imagetype=mvt";
    const thisURL = "https://mapcache.theo-spatial.online/gmaps/" + mapcacheLayer + "@g/{z}/{x}/{y}.mvt";
    const thisSource = new ol.source.VectorTile({
        url: thisURL,
        crossOrigin: "anonymous",
        format: new ol.format.MVT(),
        extent: thisExtent,
    });
    //this line is NB, else cesium doesn not load the vectortile layer
    thisSource.set('olcs_skip', false);
    return thisSource;
}
const pathTilesSource = getMVTSource("pathtiles-mvt", 
    [2038119.2465121201,-4076923.8475282304,2058360.7144259408,-4017133.6445591315]);
const platteklipSource = getMVTSource("platteklip-mvt", 
    [2049129.8796103799,-4023696.5210382197,2050139.5139960299,-4022803.8080727299]);
const duiwelspiekSource = getMVTSource("duiwelspiek-mvt", 
    [2050970.4472031099,-4023214.8854292398,2052590.8471069401,-4022646.9369096099]);
const skeletongorgeSource = getMVTSource("skeletongorge-mvt", 
    [2050019.3446057199,-4026712.6211081598,2051163.0744499699,-4026003.6100215897]);
const smutstrackSource = getMVTSource("smutstrack-mvt", 
    [2051759.2348509700,-4027093.9405317399,2051814.1487557799,-4026934.5267069898]);
const kasteelpoortSource = getMVTSource("kasteelpoort-mvt", 
    [2047088.0463783000,-4025082.5144920297,2047677.6723251899,-4024090.3563925898]);
const leeukopSource = getMVTSource("leeukop-mvt", 
    [2038119.2465121198,-4076923.8475282299,2058360.7144259400,-4017133.6445591300]);
const wagonroadSource = getMVTSource("wagonroad-mvt", 
    [2053790.0808493099,-4043822.0226606400,2054981.1548729999,-4043468.6728468500]);

function getMVTLayer(thisSource, thisColour = defaultColour, thisWidth = 1.25) {
    return new ol.layer.VectorTile({
        source: thisSource,
        declutter: true,
        style: getStyle(thisColour, thisWidth),
        //all layers start off invisible else ol-cesium loads them for half the globe
        visible: false
    });
}
const mbSatelliteLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: mbURL,
    }),
    visible: false
});

const pathTilesLayer = getMVTLayer(pathTilesSource);
const platteklipLayer = getMVTLayer(platteklipSource, platteklipColour, 1.75);
const duiwelspiekLayer = getMVTLayer(duiwelspiekSource, duiwelspiekColour, 1.75);
const skeletongorgeLayer = getMVTLayer(skeletongorgeSource, skeletongorgeColour, 1.75);
const smutstrackLayer = getMVTLayer(smutstrackSource, smutstrackColour, 1.75);
const kasteelpoortLayer = getMVTLayer(kasteelpoortSource, kasteelpoortColour, 1.75);
const leeukopLayer = getMVTLayer(leeukopSource, leeukopColour, 1.75);
const wagonroadLayer = getMVTLayer(wagonroadSource, wagonroadColour, 1.75);

//2d map setup
const map2d = new ol.Map({
    target: mapDiv,
    layers: [
        mbSatelliteLayer,
        pathTilesLayer,
        platteklipLayer,
        duiwelspiekLayer,
        skeletongorgeLayer,
        smutstrackLayer,
        kasteelpoortLayer,
        leeukopLayer,
        wagonroadLayer,
    ],
    view: new ol.View({
        center: [0, 0],
        zoom: 2,
    }),
});
//3d map setup
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
//default to harbour view
scene3d.camera.setView(harbourView);
//only set the layers visible now, else we load the whole world
mbSatelliteLayer.setVisible(true);
pathTilesLayer.setVisible(true);
//set up the ol controls (zoom etc)
//get the container 
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

//hide all the indidvidual trails before switching to a different one
function hideAllTrails() {
    platteklipLayer.setVisible(false);
    duiwelspiekLayer.setVisible(false);
    skeletongorgeLayer.setVisible(false);
    smutstrackLayer.setVisible(false);
    kasteelpoortLayer.setVisible(false);
    leeukopLayer.setVisible(false);
    wagonroadLayer.setVisible(false);
}
//change view controller
harbourRow.addEventListener("click", function() {
    hideAllTrails();
    scene3d.camera.setView(harbourView);
});
function changeView(thisView, thisLayer) {
    hideAllTrails();
    scene3d.camera.flyTo(thisView);
    thisLayer.setVisible(true);
};
platteklipRow.addEventListener("click", function() {
    changeView(platteklipView, platteklipLayer);
});
duiwelspiekRow.addEventListener("click", function() {
    changeView(duiwelspiekView, duiwelspiekLayer);
});
skeletongorgeRow.addEventListener("click", function() {
    changeView(skeletongorgeView, skeletongorgeLayer);
});
smutstrackRow.addEventListener("click", function() {
    changeView(smutstrackView, smutstrackLayer);
});
kasteelpoortRow.addEventListener("click", function() {
    changeView(kasteelpoortView, kasteelpoortLayer);
});
leeukopRow.addEventListener("click", function() {
    changeView(leeukopView, leeukopLayer);
});
wagonroadRow.addEventListener("click", function() {
    changeView(wagonroadView, wagonroadLayer);
});
