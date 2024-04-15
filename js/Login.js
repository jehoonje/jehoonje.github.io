

document.querySelector(".login-btn").addEventListener("click", () => {
  const $id = document.querySelector('.user-name');
  const userName = $id.value;
  const userNameJSON = JSON.stringify(userName);
  window.localStorage.setItem("userName", userName);
    alert(`${userName}님 환영합니다.`);
});
document.querySelector('.sub-container').addEventListener('keyup', (e) => {
  if(e.key === 'Enter') document.querySelector(".login-btn").click();
})