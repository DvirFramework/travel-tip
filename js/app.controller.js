import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onRemoveLocation =onRemoveLocation
window.onGetUserPos =onGetUserPos


function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
            renderLocations()
        })
        .catch(() => console.log('Error: cannot init map'))
}

function renderLocations() {
    locService.getLocs().then(locs => {
        var locations = locs
        const elTable = document.querySelector('.locations-table')
        var strHtml = locations.map(location => `<tr class="place"><td>${location.name}</td>
                                       <td>${location.lat}</td> <td>${location.lng}</td><td><button class="go"
                                        onclick="onPanTo(${location.lat},${location.lng})">GO</button><td><button class="remove" 
                                        onclick="onRemoveLocation('${location.name}')">DELETE</button>`).join('')
        elTable.innerHTML = strHtml

    })
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
            const place = prompt('Enter your location\'s name:')
            document.querySelector('.user-pos').innerText = place
            return {pos, place}
            })
        .then(loc => locService.getEmptyLoc(loc.place, loc.pos.coords.latitude, loc.pos.coords.longitude))
        .then(loc => locService.save(loc))
        .then(loc => onPanTo(loc.lat, loc.lng))
        .then(() => renderLocations())
        .catch(err => {
            console.log('err!!!', err)
        })
}

// function onAddMarker() {
//     console.log('Adding a marker')
//     mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
// }

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
        })
}

function onPanTo(lat , lng) {
    console.log('Panning the Map')
    mapService.panTo(lat , lng)
}

function onRemoveLocation(name) {
    locService.remove(name)
       .then(() => renderLocations())
       .catch(error => console.error('Error removing loc:', error))
}

