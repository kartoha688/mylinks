// Перемикання теми
const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("light");

    if (document.body.classList.contains("light")) {
        themeBtn.textContent = "☀️";
    } else {
        themeBtn.textContent = "🌙";
    }

});


// Кнопки проєктів
function showProject(projectName) {

    alert("Ви відкрили проєкт: " + projectName);

}


// Нагодувати мавпочку
const feedBtn = document.getElementById("feedBtn");
const feedCount = document.getElementById("feedCount");
const avatar = document.querySelector(".avatar");

let bananas = 0;

feedBtn.addEventListener("click", function () {

    bananas++;
    feedCount.textContent = "З'їдено бананів: " + bananas;

    avatar.classList.remove("bounce");
    void avatar.offsetWidth; // перезапуск анімації
    avatar.classList.add("bounce");

});


// Кнопка "нагору"
const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", function () {
    if (window.scrollY > 400) {
        topBtn.classList.add("show");
    } else {
        topBtn.classList.remove("show");
    }
});

topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
});


// Форма
const form = document.getElementById("contactForm");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("name").value;

    alert("Дякую, " + name + "! Повідомлення відправлено.");

    form.reset();

});