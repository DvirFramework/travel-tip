import { storageService } from "./async-storage.service.js"

export const locService = {
    getLocs
}

var gLocations = []


const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 }, 
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
        }, 2000)
    })
}

function query() {
    return storageService.query(LOACATION_KEY).then((locations) => {
      return locations
    })
  }
  
  function get(locationId) {
    return storageService.get(LOACATION_KEY, locationId)
  }
  
  function remove(locationId) {
    return storageService.remove(LOACATION_KEY, locationId)
  }
  
  function save(location) {
    if (location.id) {
      return storageService.put(LOACATION_KEY, location)
    } else {
      return storageService.post(LOACATION_KEY, location)
    }
  }
  
  function getPlaces() {
    return storageService.query()
  }
  
  function _createLocation( name, lat, lng, weather) {
    return {
      name,
      lat,
      lng,
      weather,
      createdAt:Date.now(),
      updatedAt:Date.now()
    }
  }
  
  function _createLocations() {
    gLocations = storageService.load(LOACATION_KEY)
    if (!gLocations || !gLocations.length) {
      gLocations = [
        _createLocation(
          "My house",
          32.690238,
          35.196458,
          weather
        )
      ]
      saveToStorage(LOACATION_KEY, gLocations)
    }
  }
  
  function addLocation(name, lat, lng, zoom) {
    gLocations.push(_createLocation(name, lat, lng, zoom))
    storageService.post(LOACATION_KEY, gLocations)
  }
  
  function getPlaceById(placeId) {
    return gLocations.find((place) => place.id === placeId)
  }
  

