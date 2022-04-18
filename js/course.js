let map;
let mapOverview;
let service;
let geocoder;
let infoWindow;
let marker;
let markers = []; // 마커 정보를 배열에 담음
var markersFinal = []; // 최종 마커 정보를 배열에 담음
let lineSymbol;

let path = [];
let poly;
let polys = []; // 위도, 경도 정보를 배열에 담음
let polyIndex = 0;

let latLng;
let latLngs = []; // 이전 여행지를 중복해서 추가하려고 할때 체크하기 위한 용도

let $rateYo = $("#placeRating").rateYo({
  rating: 0,
  readOnly: true
});

const placeNmEl = document.getElementById("placeNm");
const placeAddrEl = document.getElementById("placeAddr");
const placePhotoEl = document.getElementById("placePhoto");

let tripData = {
  tripTitle: '',
  author: '김재현',
  tripSchedule: [
    // {
    //   placeNm: '',
    //   placeAddr: '',
    //   placeRating: '',
    //   placePhoto: '',
    //   placeMemo: '',
    // }
  ],
  mapInfo: [
    // day 1
    // {
    //   markersFinal,
    //   path,
      // polys,
      // latLngs
    // }
  ]
};

function initMap() {
  const incheon = new google.maps.LatLng(37.45639, 126.70528);
  const zoom = 15;

  map = new google.maps.Map(document.getElementById("map"), {
    center: incheon,
    zoom,
    mapTypeId: google.maps.MapTypeId.HYBRID
  });

  mapOverview = new google.maps.Map(document.getElementById("mapOverview"), {
    center: incheon,
    zoom
  });

  infoWindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  geocoder = new google.maps.Geocoder();

  // 심볼 정의
  lineSymbol = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    scale: 5,
    strokeColor: "#ffff00",
  };

  // 경로 라인 생성
  poly = new google.maps.Polyline({
    // path,
    icons: [
      {
        icon: lineSymbol,
        offset: "100%",
      },
    ],
    strokeColor: "#0000ff",
    strokeOpacity: 0.6,
    strokeWeight: 5,
  });
  poly.setMap(mapOverview);
  // 경로 그리기
  animateCircle(poly);

  // 맵에 클릭 이벤트 리스너 등록
  map.addListener("click", (event) => {
    console.log(event);

    // 선택한 곳 위도, 경도 정보 전역으로 저장
    latLng = event.latLng;

    // 이전 마커 초기화 후 새 마커 추가
    deleteMarkers();
    addMarker(event.latLng);

    // place 정보가 있는 곳과 없는 곳을 나눠서 처리
    let request;
    if (event.placeId) {
      request = {
        placeId: event.placeId,
        // fields: ["name", "formatted_address", "place_id", "geometry"],
      };
      getPlaceInformation(request);
    } else {
      request = {
        location: event.latLng
      };
      getAddressInformation(request);
    }
  });

  // 현재 내 위치 찾기
  const locationButton = document.createElement("button");
  locationButton.textContent = "현재 위치 찾기";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
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

// 장소 정보 구하기
function getPlaceInformation(request) {
  service.getDetails(request, (place, status) => {
    // console.log(status);
    console.log(place);

    if (
      status === google.maps.places.PlacesServiceStatus.OK &&
      place &&
      place.geometry &&
      place.geometry.location
    ) {
      placeNmEl.value = place.name;
      placeAddrEl.value = place.formatted_address;
      $rateYo.rateYo("rating", place.rating || 0);
      placePhotoEl.setAttribute("src", place.photos && place.photos[0].getUrl() || "../img/no-data.svg");

      // path 배열 만들기
      // path.push({
      //   lat: place.geometry.location.lat(),
      //   lng: place.geometry.location.lng()
      // });
    } else {
      // placeId는 존재하는데 place 정보가 존재하지 않을 경우 예외처리
      getAddressInformation({ location: latLng });
    }
  });
}

// 장소 정보가 없는 곳의 주소 정보 구하기
function getAddressInformation(request) {
  geocoder.geocode(request, (results, status) => {
    console.log(results);
    if (status == 'OK') {
      if (results[0]) {
        let infowindow = new google.maps.InfoWindow({
          content: '주소: ' + results[0].formatted_address
        });
        infowindow.open(map, marker);
        
        placeNmEl.value = "정보 없음";
        placeAddrEl.value = results[0].formatted_address;
        $rateYo.rateYo("rating", 0);
        placePhotoEl.setAttribute("src", "../img/no-data.svg");
      } else {
        window.alert('No results found');
      }
    } else {
      // alert('Geocode was not successful for the following reason: ' + status);

      // 이상한 바다 한가운데 아무런 정보도 없는곳 찍었을 때 null값 들어가는 에러 해결
      placeNmEl.value = "정보 없음";
      placeAddrEl.value = "정보 없음";
      $rateYo.rateYo("rating", 0);
      placePhotoEl.setAttribute("src", "../img/no-data.svg");
    }
  });
}

// 여행지 추가하기
function addPlace() {
  // 맵을 클릭하여 위도, 경도 정보가 존재할때만 여행지 추가 로직 진행
  if (latLng != null && latLng != "") {
    // 이전에 선택한 여행지를 중복으로 추가못하게 막기
    if (latLngs[latLngs.length - 1] == latLng) {
      alert("방금 등록하신 여행지입니다. 다른 여행지를 선택해 주세용! +_+");
      return;
    }
    latLngs.push(latLng);
  
    // 맵 클릭시 새로운 경로 라인 정보 추가
    addLatLng(latLng);
  
    marker = new google.maps.Marker({
      position: latLng,
      map: mapOverview,
      animation: google.maps.Animation.BOUNCE
    });
    markersFinal.push(marker);
    
    mapOverview.setCenter(latLng);
    mapOverview.setZoom(17);

    // tripData에 추가
    tripData.tripSchedule.push({
      placeNm: placeNmEl.value,
      placeAddr: placeAddrEl.value,
      placeRating: $rateYo.rateYo("rating"),
      placePhoto: placePhotoEl.getAttribute("src"),
      placeMemo: $("#placeMemo").val(),
    });

    // input 초기화
    // placeNmEl.value = "";
    // placeAddrEl.value = "";
    // $rateYo.rateYo("rating", 0);
    // placePhotoEl.setAttribute("src", "../img/no-data.svg");
    $("#placeMemo").val("");
  } else {
    alert("가고싶은 여행지를 먼저 선택하세요~ !" + "(\'(\")\')!");
  }
}

// 경로 라인 정보 추가하기
function addLatLng(location) {
  path = poly.getPath(); // path 정보 담을 배열 객체 가져옴
  path.push(location);
  polys.push(location); // 위도, 경도를 배열에 담기
  polyIndex++;
}

// Adds a marker to the map and push to the array.
function addMarker(position) {
  marker = new google.maps.Marker({
    position,
    map,
  });

  markers.push(marker);
}

function setMapOnAll(map) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function hideMarkers() {
  setMapOnAll(null);
}

function showMarkers() {
  setMapOnAll(map);
}

function deleteMarkers() {
  hideMarkers();
  markers = [];
}

function animateCircle(line) {
  let count = 0;

  window.setInterval(() => {
    count = (count + 1) % 200;

    const icons = line.get("icons");

    icons[0].offset = count / 2 + "%";
    line.set("icons", icons);
  }, 20);
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

function saveTrip() {
  if (typeof(Storage) !== "undefined") {
    tripData.tripTitle = document.getElementById("tripTitle").value;
    console.log(tripData);

    localStorage.setItem(Date.now() + "_tripdata", JSON.stringify(tripData));

    location.href = "/pages/list.html";
  } else {
    alert("Sorry! No Web Storage support..");
  }
}

function cancelTrip() {
  let result = confirm("작성한 내용이 전부 날라갑니다. 그래도 나가시겠습니까?");

  if (result) {
    location.href = "/pages/list.html";
  }
}