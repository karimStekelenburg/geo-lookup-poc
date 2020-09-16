import * as h3 from "h3-reactnative";
import * as Location from 'expo-location';

export function getCurrentIndexGeoJson(loc: Location.LocationData, res: number) {
    return h3.h3ToGeoBoundary(h3.geoToH3(loc.coords.latitude, loc.coords.longitude, res), true)
}

export function getAreaGeoJson(loc: Location.LocationData) {
    let index = h3.geoToH3(loc.coords.latitude, loc.coords.longitude, 7) 
    let kRing = h3.kRing(index, 5)

    var featureCollection: GeoJSON.GeoJSON = {
        "type": "FeatureCollection",
        "features": []
      }

    var features = []

    for (var x of kRing) {

        let feature: GeoJSON.Feature = {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "Polygon",
              "coordinates": [h3.h3ToGeoBoundary(x, true)]
            }
          }

        features.push(feature)
    }
    featureCollection.features = features
    return featureCollection
}