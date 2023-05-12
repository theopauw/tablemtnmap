//external tokens
const MB_TOKEN = "pk.eyJ1IjoidGhlb3BhdXciLCJhIjoiY2xnYXc0bGwxMDBkajNqcWk5M2NvMDR0byJ9.vfpnit5GuGpF_OAjU_YlfQ";
//html elements
const mapDiv = document.getElementById("mapDiv");
//URL's 
const mbURL = "https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=" + MB_TOKEN;
//global vars
const defaultColour = "red";

const getText = function (feature) {
    let userObj = feature.get("user");
    return userObj["username"];
};
const createTextStyle = function(feature) {
    return new ol.style.Text({
        text: getText(feature),
        fill: new ol.style.Fill({color: "red"}),
        stroke: new ol.style.Stroke({color: "white", width: 3}),
        offsetY: -15,
    });
}
//set up data sources and layers
function getStyle(feature, resolution) {
    const image = new ol.style.Circle({
        radius: 5,
        fill: null,
        stroke: new ol.style.Stroke({color: "red", width: 1.5}),
    });
    return new ol.style.Style({
        image: image,
        text: createTextStyle(feature)
    });
};

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');
async function postURL(url) {
    const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: { "X-CSRFToken": csrftoken },
    });
    return response.text();
}
function getGeoJSONSource(geoJSONURL) {
    const thisSource = new ol.source.Vector({
        loader: function() {
            const format = new ol.format.GeoJSON({
                dataProjection: "EPSG:3857",
                featureProjection: "EPSG:3857",
            });
            postURL(geoJSONURL).then((text) => {
                this.addFeatures(format.readFeatures(text));
            });
        }
    });
    return thisSource;
}
const userPointsSource = getGeoJSONSource("/userprofile/userlocationpoints");

function getGeoJSONLayer(thisSource, thisColour = defaultColour, thisWidth = 1.25) {
    return new ol.layer.Vector({
        source: thisSource,
        style: getStyle,
    });
}
const mbSatelliteLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: mbURL,
    }),
});

const userPointsLayer = getGeoJSONLayer(userPointsSource);

//2d map setup
const map = new ol.Map({
    target: mapDiv,
    layers: [
        mbSatelliteLayer,
        userPointsLayer,
    ],
    view: new ol.View({
        center: [0, 0],
        zoom: 2,
    }),
});
