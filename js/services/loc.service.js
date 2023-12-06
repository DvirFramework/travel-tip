import { storageService } from "./async-storage.service.js"
import { utilService } from "./util.service.js"

const LOACATION_KEY = "locaitionDB"
_createLocations()

export const locService = {
  getLocs,
  query,
  get,
  remove,
  save,
  addLocation,
  getPlaceById,
  getPlaces,
  getEmptyLoc

}

var gLocations = []


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

function remove(locationName) {
  return storageService.remove(LOACATION_KEY, locationName)
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

function _createLocation(name, lat = 123, lng = 456, ) {
  return {
    id:utilService.makeId(),
    name,
    lat,
    lng,
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

  const locations = locationNames.map((locationName) => {
    const location = _createLocation(locationName)
    return location
  })

  utilService.saveToStorage(LOACATION_KEY, locations)
}

// function getEmptyLoc(name, lat, lng) {
//   return {
//     name,
//     lat,
//     lng,
//     createAt: new Date(),
//     updatedAt: new Date(),
//   }
// }

function addLocation(name, lat, lng, zoom) {
  gLocations.push(_createLocation(name, lat, lng, zoom))
  storageService.post(LOACATION_KEY, gLocations)
}

function getPlaceById(placeId) {
  return gLocations.find((place) => place.id === placeId)
}
