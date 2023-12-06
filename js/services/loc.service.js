import { storageService } from "./async-storage.service.js"
import { utilService } from "./util.service.js"
const LOACATION_KEY = "locaitionDB"
export const locService = {
  getLocs
}

var gLocations = []

// const locs = [
//   { name: "Greatplace", lat: 32.047104, lng: 34.832384 },
//   { name: "Neveragain", lat: 32.047201, lng: 34.832581 }
// ]

function getLocs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(utilService.loadFromStorage(LOACATION_KEY))
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

function _createLocation(name, lat = 123, lng = 456, weather) {
  return {
    name,
    lat,
    lng,
    weather,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
}

function _createLocations() {
  let loactions = utilService.loadFromStorage(LOACATION_KEY)
  if (!loactions || !loactions.length) {
    // gLocations = [_createLocation("My house", 32.690238, 35.196458, weather)]
    // saveToStorage(LOACATION_KEY, gLocations)
    _createDemoLocations()
  }
}
function _createDemoLocations() {
  const locationNames = ["israel", "germany", "brazil"]
  // const petDescs = ['Bobi is an amazing dog', 'Charli is a curious cat', 'Just one look at Pinchi']

  const locations = locationNames.map((locationName, i) => {
    const location = _createLocation(locationName)
    // pet.desc = petDescs[i]
    return location
  })

  utilService.saveToStorage(LOACATION_KEY, locations)
}

function addLocation(name, lat, lng, zoom) {
  gLocations.push(_createLocation(name, lat, lng, zoom))
  storageService.post(LOACATION_KEY, gLocations)
}

function getPlaceById(placeId) {
  return gLocations.find((place) => place.id === placeId)
}
