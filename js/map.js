// 첫화면
alert("저장하고 싶은 러닝 스팟을 저장해 주세요!");
function setName() {
  const userName = localStorage.getItem("userName") || "회원";
  document.querySelector(
      "#user-name"
  ).textContent = `${userName}님 환영합니다.`;
}

// Google Maps 초기 셋팅 함수 Google에서 제공한 가이드 참조
async function initMap() {
    // Request needed libraries.
    const { Map } = await google.maps.importLibrary("maps");
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 17,
        center: { lat: 37.5564853, lng: 126.9451992 },
        mapId: "DEMO_MAP_ID",
    });

    /////=======마커========/////

    // 이전에 저장된 마커가 있다면 불러옵니다.
    const savedMarkers = JSON.parse(localStorage.getItem("markers")) || [];

    // 이전에 저장된 마커를 지도에 추가합니다.
    savedMarkers.forEach((markerPosition) => {
        placeMarkerAndPanTo(markerPosition, map);
    });

    // 이벤트 함수 ===========================
    map.addListener("click", (e) => {
        const markerPosition = e.latLng.toJSON(); // 마커의 위치를 JSON 형태로 변환하여 저장합니다.
        placeMarkerAndPanTo(markerPosition, map);

        // 클릭한 위치의 마커를 로컬 스토리지에 저장합니다.
        savedMarkers.push(markerPosition);
        localStorage.setItem("markers", JSON.stringify(savedMarkers));
    });
}

//=============================== 커스텀 아이콘 ====////

function placeMarkerAndPanTo(markerPosition, map) {
    const customIcon = {
        url: "../img/map2.png", // 커스텀 아이콘의 URL을 지정합니다.
        scaledSize: new google.maps.Size(70, 60), // 아이콘의 크기를 조절합니다.
        origin: new google.maps.Point(0, 0), // 아이콘의 원점을 지정합니다.
        anchor: new google.maps.Point(25, 25), // 마커의 기준점을 지정합니다.
    };

    new google.maps.Marker({
        position: markerPosition,
        map: map,
        icon: customIcon, // 커스텀 아이콘을 마커에 적용합니다.
    });
    map.panTo(markerPosition);
}

///============ 함수 실행 =======/////
initMap();
setName();

// ...

///============ 로컬 스토리지 삭제 ==============///////

document.querySelector(".fas.fa-plus").addEventListener("click", () => {
    localStorage.removeItem("markers");
    alert("마커가 삭제되었습니다. 페이지를 새로고침합니다.");
    location.reload(); // 페이지를 새로고침합니다.
});

/////  ========   /////


