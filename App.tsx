import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import MapView, { Geojson } from 'react-native-maps';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { getAreaGeoJson, getCurrentIndexGeoJson } from "./src/hex-util";
import * as Location from 'expo-location';

interface UserLocation {
  lat: number
  lon: number
}


/**
 * lat offset = 25.5 - (-10.711270) = - 36.21127
 * lon offset = -10.691550 - 25.455420 = -36,14697
 */


export default function App() {
  // const [location, setLocation] = useState<Location.LocationData | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState('');
  const [geoJson, setGeoJson] = useState<GeoJSON.GeoJSON>(
    {
      "type": "FeatureCollection",
      "features": [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            // coordinates: [location.coords.latitude, location.coords.longitude],
            coordinates: [53.173119, 5.121420],
          }
        }
      ]
    }
  );

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();

      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }
      let location = await Location.getCurrentPositionAsync({});
      const myPlace: GeoJSON.GeoJSON  = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              // coordinates: [location.coords.latitude, location.coords.longitude],
              coordinates: [location.coords.longitude, location.coords.latitude],
              // coordinates: [52.090736, 5.121420],
              // coordinates: [37.785834, -122.406417],
            }
          }
        ]
      };
      let areaJson = getAreaGeoJson(location)
      setGeoJson(areaJson)
      // setGeoJson(getCurrentIndex(location!, 4));
    })();

  }, [])
  
  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  }
  // else if (location) {
  //   text = JSON.stringify(location);
  // }

  return (
    <View style={styles.container}>
      <MapView style={styles.mapStyle}>
        <Geojson geojson={geoJson} />
      </MapView>
      <Text>{text}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
