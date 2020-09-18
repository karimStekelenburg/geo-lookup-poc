import * as h3 from "h3-reactnative";
import * as Location from 'expo-location';
import { TouchableHighlightBase } from "react-native";



export class HexController {
  public currentLocation: Location.LocationData
  public resolution: number

  constructor(initialPos: Location.LocationData, resolution: number) {
    this.currentLocation = initialPos
    this.resolution = resolution
  }


  getCurrentHexCenter() {
    return h3.h3ToGeo(this.getCurrentHexIndex())
  }

  private calculateDistance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2))
  }

  private getHexArmLength() {

    let verticies = this.getCurrentHexVerticies()
    let distances = []
    for (let v of verticies) {
      for (let n of verticies) {
        distances.push(
          {
            p1: v,
            p2: n,
            distance: this.calculateDistance(v[0], v[1], n[0], n[1])
          }
        )
      }
    }
    distances = distances.sort((a, b) => {return a.distance-b.distance});
    distances = distances.filter((x) => {return x.distance != 0})
    return distances[0]
  }

  

  public getCurrentHexIndex(): string {
    return h3.geoToH3(this.currentLocation.coords.latitude, this.currentLocation.coords.longitude, this.resolution)
  }

  public getCurrentHexVerticies(): Array<Array<number>> {
    return h3.h3ToGeoBoundary(this.getCurrentHexIndex(), true)
  }

  // workspace means all cells around our current location that we'll render
  public getWorkspaceGeoJson(kRingRange: number) { 
    let kRing = h3.kRing(this.getCurrentHexIndex(), kRingRange)

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
    
    // let points = this.getCurrentHexVerticies();
    
    // for (let p of points) {
    //   let feature: GeoJSON.Feature = {
    //     "type": "Feature",
    //     "properties": {},
    //     "geometry": {
    //       "type": "Point",
    //       "coordinates": p
    //     }
    //   }
    //   features.push(feature) 
    // }

    featureCollection.features = features
    return featureCollection
  }

  calcIncircleRadius() {
    let closestDelta = this.getHexArmLength()
    let armDeltaInMeters = convertDeltaPToMeters(closestDelta.p1[0], closestDelta.p1[1], closestDelta.p2[0], closestDelta.p2[1])
    return (armDeltaInMeters / (2 * Math.tan(Math.PI / 6)))
    // return armDeltaInMeters
  }
}

function convertDeltaPToMeters(lat1:number , lon1:number , lat2:number , lon2:number ){  // generally used geo measurement function
  var R = 6378.137; // Radius of earth in KM
  var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
  var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
  Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d * 1000; // meters
}