# geo-lookup-poc

## Dependencies
- [H3 (hexagon lib)](https://eng.uber.com/h3/)
- [MapView (map lib for rn)](https://docs.expo.io/versions/latest/sdk/map-view) 

## Lingo
In order to make life easy, we'll introduce some terms here that refer to project specific concepts.

#### Grayzone
The term 'grayzone' is used to refer to the area between the circle-shaped geo-fences we'll use.


## Todo
- [x] Initialize expo app
- [x] Get a map goin' ([MapView will do](https://docs.expo.io/versions/latest/sdk/map-view/))
- [ ] Project H3 hexagons onto el map
- [ ] Find H3 hex of current location
- [ ] Find neigboring hexes
- [ ] Spawn geo-fence in current hex
- [ ] Upon exit of the geo-fence, calculate position relative to the exited hex
- [ ] Spawn geo-fences in possible re-entry hexes
- [ ] Upon re-entry, send current loc hex to the server
- [ ] Repeat process and open up a beer. Who's a good boy?
