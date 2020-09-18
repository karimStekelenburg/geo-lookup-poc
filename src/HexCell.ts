import * as h3 from "h3-reactnative";
import { Vector } from "./Vector";



class HexCell {
    h3Index: string

    constructor(index: string) {
        this.h3Index = index
    }

    get center(): Vector {
        let coords = h3.h3ToGeo(this.h3Index)
        return {
            latitude: coords[0],
            longetude: coords[1],
        }
    }

    get vertices(): Array<Vector> {
        let coords = h3.h3ToGeoBoundary(this.h3Index)
        return coords.map((x: Array<number>) =>  {
            return {
                latitude: x[0],
                longetude: x[1]
            }
        })
    }

    get geoJsonFeature(): GeoJSON.GeoJSON {
        return {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "Polygon",
              "coordinates": [h3.h3ToGeoBoundary(this.h3Index, true)]
            }
          }
    }

}