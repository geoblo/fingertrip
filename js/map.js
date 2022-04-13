let map;
let service;
let infoWindow;
let markers = [];

function initMap() {
  const incheon = new google.maps.LatLng( 37.45639, 126.70528);
  map = new google.maps.Map(document.getElementById("map"), {
    center: incheon,
    zoom: 15,
  });

  infoWindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);

  // 맵에 클릭 이벤트 리스너 등록
  map.addListener("click", (event) => {
    console.log(event);
    addMarker(event.latLng);

    // 장소 정보
    const request = {
      placeId: event.placeId,
      // fields: ["name", "formatted_address", "place_id", "geometry"],
    };

    service.getDetails(request, (place, status) => {
      if (
        status === google.maps.places.PlacesServiceStatus.OK &&
        place &&
        place.geometry &&
        place.geometry.location
      ) {
        console.log(status);
        console.log(place);

        // const marker = new google.maps.Marker({
        //   map,
        //   position: place.geometry.location,
        // });

        // google.maps.event.addListener(marker, "click", () => {
        //   const content = document.createElement("div");
        //   const nameElement = document.createElement("h2");

        //   nameElement.textContent = place.name;
        //   content.appendChild(nameElement);

        //   const placeIdElement = document.createElement("p");

        //   placeIdElement.textContent = place.place_id;
        //   content.appendChild(placeIdElement);

        //   const placeAddressElement = document.createElement("p");

        //   placeAddressElement.textContent = place.formatted_address;
        //   content.appendChild(placeAddressElement);
        //   infowindow.setContent(content);
        //   infowindow.open(map, marker);
        // });
      }
    });
  });

  // 현재 내 위치 찾기
  const locationButton = document.createElement("button");
  locationButton.textContent = "현재 위치 찾기";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("내 위치");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}

// Adds a marker to the map and push to the array.
function addMarker(position) {
  const marker = new google.maps.Marker({
    position,
    map,
  });

  markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function hideMarkers() {
  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  hideMarkers();
  markers = [];
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

// function createMarker(place) {
//   if (!place.geometry || !place.geometry.location) return;

//   const marker = new google.maps.Marker({
//     map,
//     position: place.geometry.location,
//   });

//   google.maps.event.addListener(marker, "click", () => {
//     infoWindow.setContent(place.name || "");
//     infoWindow.open(map);
//   });
// }