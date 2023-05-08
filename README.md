# Theo's Geospatial Demo

This is a small [Django](https://www.djangoproject.com/) project I made as a demonstration. It uses built-in Django authentication and has an index page. Styling is mostly done with [Bootstrap 5](https://getbootstrap.com/).

Folder structure:

index/ - Django app for index page.  
static/ - All static files (js, css, images).  
tablemtnmap/ - Django app for Table Mountain 3D Trail Viewer  
templates/ - Django templates (html) shared between apps (index and tablemtnmap also have their own).  
theospatial/ - Django Project folder.

## Table Mountain 3D Trail Viewer

This app uses [ol-cesium](https://openlayers.org/ol-cesium/) to create a 3D viewer of some popular hiking trails around Cape Town's iconic Table Mountain. I have worked with [OpenLayers](https://openlayers.org/) extensively but have never used [Cesium](https://www.cesium.com/) or ol-cesium before and I was keen to try it out. 

I built a small control that you can click on to fly to various hiking trails or return to the default view. When flying to a specific trail, it is highlighted in the colour shown on the control. 

The zoom and North-up controls are the default ones from OpenLayers. I also added a help control from  Cesium and changed the styling a bit so it matches the OpenLayers controls.

Data: Trails obtained from the [OpenStreetMap](https://www.openstreetmap.org/) roads layer as downloaded from [BBBike](https://extract.bbbike.org/). I cleaned it up a bit in QGIS and uploaded it to PostGIS. It is served through [MapServer](https://mapserver.org/) and [MapCache](https://mapserver.org/mapcache/index.html#mapcache) as vector tiles (MVT).
Satellite backdrop from [Mapbox](https://docs.mapbox.com/data/tilesets/reference/mapbox-satellite/).

## Server and software

VM: Shared-CPU VM at [Linode](https://www.linode.com/products/shared/) running [Rocky Linux 9](https://rockylinux.org/).

Webserver: [Apache](https://httpd.apache.org/) with [mod_wsgi](https://modwsgi.readthedocs.io/en/master/) to run Django.

GIS Server:  [MapServer 8.0](https://mapserver.org/) and [MapCache 1.14](https://mapserver.org/mapcache/index.html#mapcache). MapServer was installed from [EPEL 9](https://docs.fedoraproject.org/en-US/epel/) but MapCache had to be build from source (used [RPMBuild](https://www.redhat.com/sysadmin/create-rpm-package) to create an RPM file that can be installed with DNF - now hopefully it won't break when updating the system).

Database: [PostgreSQL 15](https://www.postgresql.org/docs/15/index.html) with [PostGIS 3.3](http://postgis.net/) - installed from [PGDG repos](https://www.postgresql.org/download/linux/redhat/).

Gitea: [Self-hosted Git service](https://gitea.io/en-us/). Installed as a Linux service.

Domain: purchased from [Domains.co.za](https://www.domains.co.za/).
