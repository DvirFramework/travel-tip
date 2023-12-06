import { storageService } from "./async-storage.service.js"

const LOACATION_KEY = "locaitionDB"
var gLocations = []
_createLocations()
export const mapService = {
  initMap,
  addMarker,
  panTo
}

// Var that is used throughout this Module (not global)
var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
  console.log("InitMap")
  return _connectGoogleApi().then(() => {
    console.log("google available")
    gMap = new google.maps.Map(document.querySelector("#map"), {
      center: { lat, lng },
      zoom: 15
    })
    console.log("Map!", gMap)
  })
}

function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: "Hello World!"
  })
  return marker
}

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng)
  gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve()
  const API_KEY = "AIzaSyBZUzcd-Q8iCzzRxdjkw-RlQcnf1rJ5xXM" //TODO: Enter your API Key
  var elGoogleApi = document.createElement("script")
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
  elGoogleApi.async = true
  document.body.append(elGoogleApi)

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve
    elGoogleApi.onerror = () => reject("Google script failed to load")
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
  return gLocations
}

function _createLocation(id, name, lat, lng, weather, createdAt, updatedAt) {
  return {
    id: makeId(),
    name,
    lat,
    lng,
    weather,
    createdAt,
    updatedAt
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
        weather,
        createdAt,
        updatedAt
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
