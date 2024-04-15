//todo 전역변수
const todoList = [];

/// ================ 헤더환영합니다======= /////////
function setName() {
  const userName = localStorage.getItem("userName") || "회원";
  document.querySelector(
    "#user-name"
  ).textContent = `${userName}님 환영합니다.`;
}
setName();
/// ======================================= /////////

// 달력 클릭하면 회색 배경으로 변경
//.click-bg 추가하기
let clickBgMode = false;

let $liTarget;

const $subListAgenda = document.querySelector(".list_agenda");
const $modalOverlay = document.querySelector(".modal-overlay");
const $ulDate = document.querySelector("ul.date");
const $modalTitleInput = document.querySelector(".modal-title input");
const $modalTextarea = document.querySelector(".modal-memo textarea");
let $findButtonTarget;

//

//

$ulDate.addEventListener("click", (e) => {
  const $dayBoxLi = e.target.closest(".day-box");

  //회색 배경이 있으면 이 함수를 종료한다
  [...$ulDate.children].forEach(($li) => {
    if ($li.classList.contains("click-bg")) {
      $li.classList.remove("click-bg");
    }
  });

  //////////////////////////////////////////////////////
  //회색 배경으로 변환
  $dayBoxLi.classList.toggle("click-bg");

  //

  // 지혜가 작업한 sub날짜 변경

  // 클릭한 날짜의 값 가져오기
  const clickedDate = $dayBoxLi.querySelector("p").textContent.trim();

  // 우측 일정 추가 부분에 해당 날짜를 넣어주기
  const eventDay = document.querySelector(".event_day");
  eventDay.textContent = `4월 ${clickedDate}일`;

  //지혜작업 끝

  //memo <p class="day-box-memo-button"  클릭시

  if (e.target.matches("p.day-box-memo-button")) {
    //배열에 있는 id와 클릭한 id가 같은지 확인
    const $dataId = e.target.dataset.id;
    const index = todoList.find((todo) => todo.id.toString() === $dataId);

    //배열에 있는 title 과 memo sub에 넣기
    document.querySelector("p.event_content").textContent = index.title;
    document.querySelector("p.event_memo").textContent = index.memo;
    $subListAgenda.classList.add("agenda_show");
  }
});

//오른쪽 마우스 클릭 시 모달창 나오는 작업

$ulDate.addEventListener("contextmenu", (e) => {
  document.querySelector(".modal-save").textContent = "저장";
  document.querySelector(".modal-delete").textContent = "닫기";

  e.preventDefault();
  //타겟 전역변수에 담기
  $liTarget = e.target;

  //style 속성 추가. left, right 넣기

  $modalOverlay.style.top = e.pageY + "px";
  $modalOverlay.style.left = e.pageX + "px";

  //.show 추가
  $modalOverlay.classList.add("show");
  if ($modalOverlay.classList.contains("show")) {
    $ulDate.addEventListener("click", () => {
      $modalOverlay.classList.remove("show");
    });
  }

  // sub 일정 숨기기
  document.querySelector(".list_agenda").classList.remove("agenda_show");

  //모달 창 초기화
  $modalTitleInput.value = "";
  $modalTextarea.value = "";
});

// 모달창 작업
document.querySelector(".modal-overlay").addEventListener("click", (e) => {
  //삭제 버튼 클릭 시 모달창 닫기

  if (e.target.matches(".modal-delete") && e.target.textContent === "삭제") {
    //배열 지우기
    const $dataId = $findButtonTarget.querySelector(".day-box-memo-button")
      .dataset.id;
    // console.log($dataId);
    const index = todoList.findIndex((todo) => todo.id.toString() === $dataId);
    console.log(index);
    todoList.splice(index, 1);

    //sub sub 내용도 지우기
    $subListAgenda.classList.remove("agenda_show");

    //일정 버튼 삭제
    console.log("삭제");
    $findButtonTarget.innerHTML = "";

    //모달창 닫기
    $modalOverlay.classList.remove("show");
  }

  if (e.target.matches(".modal-delete") && e.target.textContent === "닫기") {
    $modalOverlay.classList.remove("show");
  }

  // if (e.target.matches(".modal-delete")) {
  //   $modalOverlay.classList.remove("show");
  // }
  const $inputTitleValue = $modalTitleInput.value;
  //저장 누르면
  if (e.target.matches(".modal-save") && e.target.textContent === "저장") {
    if ($inputTitleValue === "") {
      return alert("내용을 입력하세요");
    }
    // 배열에 모달 입력값 저장
    const $textareaMemoValue = document.querySelector(
      ".modal-memo textarea"
    ).value;
    const todoId = () => {
      return todoList.length === 0 ? 1 : todoList[todoList.length - 1].id + 1;
    };
    const NewTodo = {
      id: todoId(),
      title: $inputTitleValue,
      memo: $textareaMemoValue,
    };

    //모달 내용 sub하단에 저장
    document.querySelector("p.event_content").textContent = $inputTitleValue;
    document.querySelector(".event_memo").textContent = $textareaMemoValue;

    //sub 하단 일정 나오게 하기 //.agenda_show
    $subListAgenda.classList.add("agenda_show");

    todoList.push(NewTodo);

    //모달 창 닫기
    $modalOverlay.classList.remove("show");

    //memo에 <button class="memo-text-box"><p></p></button> 넣기
    const newDiv = document.createElement("button");
    newDiv.classList.add("memo-text-box");
    newDiv.innerHTML = `<p class="day-box-memo-button" data-id="${
      todoList[todoList.length - 1].id
    }">${$inputTitleValue}</p>`;
    $liTarget.querySelector(".day-box-memo").appendChild(newDiv);
  }

  //수정을 누른다면
  if (e.target.matches(".modal-save") && e.target.textContent === "수정") {
    //버튼 내용수정
    $findButtonTarget.querySelector(".day-box-memo-button").textContent =
      $modalTitleInput.value;

    //배열 title, memo 내용 수정
    const $dataId = $findButtonTarget.querySelector(".day-box-memo-button")
      .dataset.id;
    const index = todoList.findIndex((todo) => todo.id.toString() === $dataId);
    todoList[index].title = $modalTitleInput.value;
    todoList[index].memo = $modalTextarea.value;

    //sub 창 다시보이기
    document.querySelector("p.event_content").textContent =
      $modalTitleInput.value;
    document.querySelector("p.event_memo").textContent = $modalTextarea.value;

    //모달창 닫기
    $modalOverlay.classList.remove("show");
  }
});

//버튼 더블 클릭 시 모달창 내용 수정하기

$ulDate.addEventListener("dblclick", (e) => {
  document.querySelector(".modal-save").textContent = "수정";
  document.querySelector(".modal-delete").textContent = "삭제";
  $findButtonTarget = e.target.closest(".day-box-memo");
  console.log($findButtonTarget);

  if (e.target.matches("p.day-box-memo-button")) {
    const $dataId = e.target.dataset.id;
    const index = todoList.findIndex((todo) => todo.id.toString() === $dataId);
    // console.log(index);
    $modalTitleInput.value = todoList[index].title;
    $modalTextarea.value = todoList[index].memo;

    //모달 보이게 하기
    $modalOverlay.style.top = e.pageY + "px";
    $modalOverlay.style.left = e.pageX + "px";
    $modalOverlay.classList.add("show");
  }
});

//지혜작업내용
//sub 삭제 누르는 이벤트
// 삭제된 일정을 추적하기 위한 배열
const deletedTodos = [];
document.querySelector(".event_day_wrap").addEventListener("click", (e) => {
  if (e.target.matches(".minus-icon")) {
    const $eventDayWrap = e.target.closest(".event_day_wrap");
    const $eventContent = $eventDayWrap.querySelector(".event_content");
    const $eventMemo = $eventDayWrap.querySelector(".event_memo");
    const $listAgenda = $eventDayWrap.querySelector(".list_agenda");

    // 삭제된 일정을 추적하기 위해 deletedTodos 배열에 추가
    const deletedTodo = {
      title: $eventContent.textContent,
      memo: $eventMemo.textContent,
    };

    deletedTodos.push(deletedTodo);

    // 해당 일정 내용 삭제
    // $eventContent.innerHTML = "";
    // $eventMemo.innerHTML = "";
    $listAgenda.innerHTML = "";

    // 메인 캘린더에서도 해당 일정 제목 삭제
    const clickedDate = $eventDayWrap.querySelector(".event_day").textContent;
    const $mainCalendar = document.querySelector(".area_calendar");
    const $targetDayBox = $mainCalendar.querySelector(
      `p.day-box[title="${clickedDate}"]`
    );

    if ($targetDayBox) {
      const $dayBoxMemo = $targetDayBox
        .closest(".day-box")
        .querySelector(".day-box-memo");
      $dayBoxMemo.innerHTML = "";
    }

    // 추가한 일정 제목 삭제
    if ($liTarget && $liTarget.querySelector(".day-box-memo")) {
      const $memoButtons = $liTarget.querySelectorAll(".memo-text-box");
      $memoButtons.forEach((button) => {
        if (button.textContent === $eventContent.textContent) {
          button.remove();
        }
      });
    }

    // 모달 창에서 추가한 일정 내용 초기화
    $modalTitleInput.innerHTML = "";
    $modalTextarea.innerHTML = "";

    // const $targetSubBox = e.target.closest(".day-box-memo");
    // $targetSubBox.innerHTML = "";
  }
});

// 미니 캘린더 전체 부분에 -> 일자 하나하나 타겟으로 가져오기
document.querySelector(".area_calendar").addEventListener("click", (e) => {
  const $targetTxt = e.target.closest(".coulmn");
  //console.log($targetTxt);

  if ($targetTxt) {
    // stamped 클래스 포함됐을 시 않을 시 나눠서 클래스 추가 & 삭제
    if (!$targetTxt.classList.contains("circle")) {
      $targetTxt.classList.add("circle");
      // $targetTxt.style.color = "white";
    } else {
      $targetTxt.classList.remove("circle");
      // $targetTxt.style.color = "black";
    }
  }
});
