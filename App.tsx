import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import MapView, { Circle, Geojson } from 'react-native-maps';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { getAreaGeoJson, getCurrentIndexGeoJson, HexController } from "./src/hex-util";
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
  const [position, setPosition] = useState({latitude: 0, longitude: 0})
  const [radius, setRadius] = useState(0)
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
            coordinates: [5.121420, 53.173119],
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
      let controller = new HexController(location, 3)
      setPosition({latitude: controller.getCurrentHexCenter()[0], longitude: controller.getCurrentHexCenter()[1]})
      setRadius(controller.calcIncircleRadius())
      setGeoJson(controller.getWorkspaceGeoJson(7))
      
      
      // setGeoJson({
      //   "type": "FeatureCollection",
      //   "features": [
      //     {
      //       type: 'Feature',
      //       properties: {},
      //       geometry: {
      //         type: 'Point',
      //         // coordinates: [location.coords.latitude, location.coords.longitude],
      //         coordinates: [5.121420, 51.173119],
      //       }
      //     }
      //   ]
      // })
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
        <Circle center={position} radius={radius} />
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
