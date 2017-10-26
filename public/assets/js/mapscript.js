
var input1 = $('#field1')
var input2 = $('#field2')
var map, marker1

function initMap () {
  var directionsService = new google.maps.DirectionsService
  var directionsDisplay = new google.maps.DirectionsRenderer
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 1.307820, lng: 103.831830},
    zoom: 19
  })
  directionsDisplay.setMap(map)

  var onChangeHandler = function () {
    calculateAndDisplayRoute(directionsService, directionsDisplay)
  }
  $('#field2').on('change', onChangeHandler)
  autoComplete()
}

function autoComplete () {
  var autocomplete1 = new google.maps.places.Autocomplete(input1[0]) // adds autocomplete feature to Start bldg field
  var autocomplete2 = new google.maps.places.Autocomplete(input2[0])

  autocomplete1.addListener('place_changed', startPostalCode)
  // autocomplete2.addListener('place_changed', endPostalCode)

  const $checkRoute = $('.checkRoute')
  $checkRoute.on('submit', function (e) {
    e.preventDefault()

    var address1 = autocomplete1.getPlace().formatted_address
    var postal1 = address1.substr(address1.length - 6)
    var address2 = autocomplete2.getPlace().formatted_address
    var postal2 = address2.substr(address2.length - 6)

    console.log('Starting from ', postal1, 'Ending at ', postal2)
    console.log(req.user)
  })
  function startPostalCode () {
    marker1.setAnimation(null)
    var place1 = autocomplete1.getPlace()
    map.setCenter(place1.geometry.location)
    marker1.setPosition(place1.geometry.location)
    marker1.setAnimation(google.maps.Animation.DROP)

    // fetch here

    // var jsonPostal = JSON.stringify({
    //   startPostal
    // })
    //
    // fetch('/route', {
    //   method: 'PUT',
    //   body: jsonPostal,
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })
    // .then(res => res.json())
    // .then(json => {
    //   console.log('add to database')
    // })
  }

  // function endPostalCode () {
  // }
}
function calculateAndDisplayRoute (directionsService, directionsDisplay) {
  marker1.setPosition(null)
  directionsService.route({
    origin: $('#field1').val(),
    destination: $('#field2').val(),
    travelMode: 'DRIVING'
  },
  function (response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response)
    } else {
      window.alert('Directions ' + status + ', please ensure valid addresses are entered in both Start and End fields.')
    }
  })
}
var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
}

function success(pos) {
  var crd = pos.coords

  marker1 = new google.maps.Marker({
    position: new google.maps.LatLng(crd.latitude, crd.longitude),
    map: map,
    animation: google.maps.Animation.BOUNCE
  })

  map.setCenter({lat: crd.latitude, lng: crd.longitude})
};

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
};

navigator.geolocation.getCurrentPosition(success, error, options) // center the map on current location