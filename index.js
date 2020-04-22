/**
 * Projeto para mostrar localidades em um map do openstreet map
 */
import 'ol/ol.css';
import {useGeographic} from 'ol/proj';
import Map from 'ol/Map';
import View from 'ol/View';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import BingMaps from 'ol/source/BingMaps';
import VectorSource from 'ol/source/Vector';
import {Icon, Style} from 'ol/style';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import apply from 'ol-mapbox-style';

useGeographic();

var  osmLayer = new TileLayer({
      source: new OSM()
    })

var styles = [
  'RoadOnDemand',
  'Aerial',
  'AerialWithLabelsOnDemand',
  'CanvasDark',
  'OrdnanceSurvey'
];
var layers = [];
var i, ii;
for (i = 0, ii = styles.length; i < ii; ++i) {
  layers.push(new TileLayer({
    visible: false,
    preload: Infinity,
    source: new BingMaps({
      key: 'Am6S4E1CnAABn9rKMtprpwtI-DQZH3a5vERaNEOwL3MSzTlU4QYblJySdHbX6ph2',
      imagerySet: styles[i]
      // use maxZoom 19 to see stretched tiles instead of the BingMaps
      // "no photos at this zoom level" tiles
      // maxZoom: 19
    })
  }));
}

var iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: 'data/point_agri.png'
      })
    });

var list = []

farmList.forEach(function(v){
  var iconFeature = new Feature({
    //  geometry: new Point(farmInfo.coordinate),
      geometry: new Point(v.coordinate),
      name: v.name,
      population: 4000,
      rainfall: 500
    });
    iconFeature.setStyle(iconStyle);
    list.push(iconFeature)

})

    


var vectorSource = new VectorSource({
  features: list
});

var vectorLayer = new VectorLayer({
  source: vectorSource
});


var layers2 = [osmLayer,vectorLayer];
//layers2.concat(layers)


var map = new Map({
  layers: layers2,
  target: 'map',
  view: new View({
    center: centerMap,
    zoom: 13
  })
});

 



var element = document.getElementById('popup');

var popup = new Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false,
  offset: [0, -50]
});
map.addOverlay(popup);

// display popup on click
map.on('pointermove', function(evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel,
    function(feature) {
      return feature;
    });
  if (feature) {
    var coordinates = feature.getGeometry().getCoordinates();
    popup.setPosition(coordinates);
    $(element).popover({
      placement: 'top',
      html: true,
      content: feature.get('name')
    });
    $(element).popover('show');
  } else {
    $(element).popover('destroy');
  }
});