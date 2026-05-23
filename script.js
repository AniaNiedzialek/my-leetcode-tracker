const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupMessage = document.getElementById("popupMessage");
const closePopupBtn = document.getElementById("closePopupBtn");

const openPopupButtons = document.querySelectorAll(".open-popup-btn");

openPopupButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const title = button.getAttribute("data-title");
    const message = button.getAttribute("data-message");

    popupTitle.textContent = title;
    popupMessage.textContent = message;

    popup.style.display = "block";
  });
});

closePopupBtn.addEventListener("click", function () {
  popup.style.display = "none";
});

window.addEventListener("click", function (event) {
  if (event.target === popup) {
    popup.style.display = "none";
  }
});