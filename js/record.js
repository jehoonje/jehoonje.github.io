// ==============변수..?==============//
let recordList = [
    // {
    //     id: 1,
    //     date: "0404",
    //     length: "4",
    //     time: "1",
    // },
    // {
    //     id: 2,
    //     date: "0405",
    //     length: "10",
    //     time: "2",
    // },
    // {
    //     id: 3,
    //     date: "0406",
    //     length: "4",
    //     time: "1",
    // },
];
let recordId = 1;
let getIdJSON = window.localStorage.getItem("recordId");
let getId = JSON.parse(getIdJSON);
recordId = getIdJSON;
let getRecordArr = window.localStorage.getItem("records"); //로컬에서 받기
let getArrRecordArr = JSON.parse(getRecordArr); //다시 코드로 변환
if (!recordList.length && !!getArrRecordArr) {
    recordList = getArrRecordArr;
    for (let i of recordList) {
        let timeSet = +i.time;
        let hourMinute = "";
        if (timeSet >= 60) {
            hourMinute = `${Math.floor(timeSet / 60)}시간${timeSet % 60}분`;
        } else {
            hourMinute = `${timeSet}분`;
        }

        const $newLi = document.createElement("li");
        $newLi.innerHTML = `<div><span class="date">${i.date[0] + i.date[1]}월${
            i.date[2] + i.date[3]
        }일</span></div>
            <div><span class="length">${i.length}km</span></div>
            <div><span class="time">${hourMinute}</span></div>
            <div><span>${(+timeSet / +i.length).toFixed(2)}</span></div>
            <button class="remove-record">삭 제</button>`;
        $newLi.dataset.id = i.id;
        $newLi.classList.add("ex-record");
        document.querySelector(".record-list").appendChild($newLi);
    }
}
function setName() {
    const userName = localStorage.getItem("userName") || "회원";
    document.querySelector(
        "#user-name"
    ).textContent = `${userName}님 환영합니다.`;
}
// ==============함수실행==============//
setName();

// 기록하기 버튼 클릭시 이벤트.
document.querySelector(".input-list").addEventListener("click", (e) => {
    if (!e.target.matches(".complete")) return;
    const newDate = document.querySelector("#date-input").value;
    const newLength = document.querySelector("#length-input").value;
    const newTime = document.querySelector("#time-input").value;
    // console.log(newDate.length);
    // if문으로입력값 비는게 있는지 체크
    if (newDate.length !== 4 || !newLength.length || !newTime.length) return;

    // console.log(e.target);
    // 각 인풋에 있는 밸류 객체로 배열에 저장하고
    const newRecord = {};
    recordId++;
    newRecord.id = recordId;
    // 날짜 밸류 받기
    document.querySelector("#date-input").value = "";
    newRecord.date = newDate;
    // 뛴거리 밸류 받기
    document.querySelector("#length-input").value = "";
    newRecord.length = newLength;
    // 뛴시간 밸류 받기
    document.querySelector("#time-input").value = "";
    newRecord.time = newTime;
    recordList.push(newRecord);
    let timeSet = +newTime;
    let hourMinute = "";
    // console.log(timeSet);
    if (timeSet >= 60) {
        hourMinute = `${Math.floor(timeSet / 60)}시간${timeSet % 60}분`;
    } else {
        hourMinute = `${newTime}분`;
    }
    // li태그로 만들어서.record-list에 어펜드차일드
    const $newLi = document.createElement("li");
    $newLi.innerHTML = `<div><span class="date">${newDate[0] + newDate[1]}월${
        newDate[2] + newDate[3]
    }일</span></div>
    <div><span class="length">${newLength}km</span></div>
    <div><span class="time">${hourMinute}</span></div>
    <div><span>${(+newTime / +newLength).toFixed(2)}</span></div>
    <button class="remove-record">삭 제</button>`;
    $newLi.dataset.id = recordId;
    $newLi.classList.add("ex-record");
    document.querySelector(".record-list").appendChild($newLi);
    let recordArr = JSON.stringify(recordList); //문자열로 변환
    window.localStorage.setItem("records", recordArr); //로컬에 저장
    let recordIdJSON = JSON.stringify(recordId); // id값 유지용 변환
    window.localStorage.setItem("recordId", recordIdJSON); //id값 유지용 저장
});
document.querySelector("li.input.record").addEventListener("keyup", (e) => {
    if (e.key !== "Enter") return;
    document.querySelector(".complete").click();
});

document.querySelector(".record-list").addEventListener("click", (e) => {
    if (!e.target.matches(".remove-record")) return;
    console.log(e.target.parentElement.dataset.id);

    // id값 연동을 통해 배열의 객체또한 제거 할 예정
    const index = recordList.findIndex(
        (record) => record.id === +e.target.parentElement.dataset.id
    );
    recordList.splice(index, 1);
    // e.target.parentElement.dataset.id
    // e.target을 기준으로 해당하는 조상li 삭제
    document.querySelector(".record-list").removeChild(e.target.parentElement);
    // console.log(recordList);
    let recordArr = JSON.stringify(recordList); //문자열로 변환
    window.localStorage.setItem("records", recordArr); //로컬에 저장
});
// setInterval(() => {
//     let getRecordArr = window.localStorage.getItem("records"); //로컬에서 받기
//     let getArrRecordArr = JSON.parse(getRecordArr); //다시 코드로 변환
//     if (!recordList.length) {
//         recordList = getArrRecordArr;
//         for (let i of recordList) {
//             let timeSet = +i.time;
//             let hourMinute = "";
//             if (timeSet >= 60) {
//                 hourMinute = `${Math.floor(timeSet / 60)}시${timeSet % 60}분`;
//             } else {
//                 hourMinute = `${timeSet}분`;
//             }

//             const $newLi = document.createElement("li");
//             $newLi.innerHTML = `<div><span class="date">${
//                 i.date[0] + i.date[1]
//             }월${i.date[2] + i.date[3]}일</span></div>
//             <div><span class="length">${i.length}km</span></div>
//             <div><span class="time">${hourMinute}</span></div>
//             <button class="remove-record">삭제하기</button>`;
//             $newLi.dataset.id = recordId;
//             $newLi.classList.add("ex-record");
//             document.querySelector(".record-list").appendChild($newLi);
//         }
//     }
//     let recordArr = JSON.stringify(recordList); //문자열로 변환
//     window.localStorage.setItem("records", recordArr); //로컬에 저장

//     // console.log(getArrRecordArr);
// }, 3000);
