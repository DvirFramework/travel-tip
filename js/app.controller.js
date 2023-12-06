import { locService } from "./services/loc.service.js"
import { mapService } from "./services/map.service.js"

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onAddLocation = onAddLocation

let gMarkers = []
var gMap

function onInit() {
  mapService
    .initMap()
    .then((map) => {
      console.log("map is ready")
      map.addListener("click", (ev) => {
        const lngLat = { lat: ev.latLng.lat(), lng: ev.latLng.lng() }
        mapService.panTo(lngLat.lat, lngLat.lng)
        mapService.addMarker(lngLat)
        onAddLocation(ev)
        console.log("Map Clicked:", lngLat)
      })
    })
    .catch(() => console.log("Error: cannot init map"))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log("Getting Pos")
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

function onAddMarker() {
  console.log("Adding a marker")
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
  locService.getLocs().then((locs) => {
    console.log("Locations:", locs)
    document.querySelector(".locs").innerText = JSON.stringify(locs, null, 2)
  })
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      console.log("User position is:", pos.coords)
      document.querySelector(
        ".user-pos"
      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
    })
    .catch((err) => {
      console.log("err!!!", err)
    })
}
function onPanTo(lat, lng) {
  console.log("Panning the Map")
  mapService.panTo(lat, lng)
}

function onAddLocation(ev) {
  console.log(ev)
  const name = prompt("location name?", "New location")
  if (!name) return
  const lat = ev.latLng.lat()
  const lng = ev.latLng.lng()

  locService
    .addLocation(name, lat, lng, 15)
    .then((newLocation) => {
      renderMarkers()
      // Optionally, do something with the newLocation if needed
      console.log("Location added:", newLocation)
    })
    .catch((error) => console.log("Error adding location:", error))
}

function renderMarkers() {
  locService
    .getLocs()
    .then((locations) => {
      console.log(console.log("Raw data from locService:", locations))
      clearMarkers() // Clear existing markers
      gMarkers = locations
        .map((location) => {
          const lat = parseFloat(location.lat)
          const lng = parseFloat(location.lng)

          if (isNaN(lat) || isNaN(lng)) {
            console.error(
              `Invalid coordinates for location: ${JSON.stringify(location)}`
            )
            return null // Skip this location if coordinates are invalid
          }

          const marker = new google.maps.Marker({
            position: { lat, lng },
            map: gMap,
            title: location.name
          })

          // You can add additional customization or event listeners to the marker here if needed

          return marker
        })
        .filter((marker) => marker !== null) // Remove markers that were skipped due to invalid coordinates
    })
    .catch((error) => console.log("Error rendering markers:", error))
}

function clearMarkers() {
  gMarkers.forEach((marker) => marker.setMap(null))
  gMarkers = []
}
