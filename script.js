// ===== Тема (з збереженням вибору) =====
const themeBtn = document.getElementById("themeBtn");
const savedTheme = localStorage.getItem("theme");

function applyTheme(isLight) {
    document.body.classList.toggle("light", isLight);
    themeBtn.textContent = isLight ? "☀️" : "🌙";
    themeBtn.setAttribute("aria-pressed", String(isLight));
}

applyTheme(savedTheme === "light");

themeBtn.addEventListener("click", function () {
    const isLight = !document.body.classList.contains("light");
    applyTheme(isLight);
    localStorage.setItem("theme", isLight ? "light" : "dark");
});


// ===== Мобільне меню =====
const menuBtn = document.getElementById("menuBtn");
const mainNav = document.getElementById("mainNav");

menuBtn.addEventListener("click", function () {
    const isOpen = mainNav.classList.toggle("open");
    menuBtn.classList.toggle("open", isOpen);
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.setAttribute("aria-label", isOpen ? "Закрити меню" : "Відкрити меню");
});

// Закривати меню після переходу за посиланням (на мобільних)
mainNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        menuBtn.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.setAttribute("aria-label", "Відкрити меню");
    });
});


// ===== Підсвічування активного пункту меню при скролі =====
const navLinks = Array.from(mainNav.querySelectorAll("a"));
const sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

const sectionObserver = new IntersectionObserver(
    function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            const id = "#" + entry.target.id;
            navLinks.forEach(function (link) {
                link.classList.toggle("active", link.getAttribute("href") === id);
            });
        });
    },
    { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach(function (section) { sectionObserver.observe(section); });


// ===== Модальне вікно проєктів (замість alert) =====
const modal = document.getElementById("projectModal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalClose = document.getElementById("modalClose");
let lastFocusedEl = null;

document.querySelectorAll(".project button").forEach(function (btn) {
    btn.addEventListener("click", function () {
        lastFocusedEl = document.activeElement;
        modalTitle.textContent = btn.dataset.title || "Проєкт";
        modalText.textContent = btn.dataset.text || "";
        modal.hidden = false;
        modalClose.focus();
        document.addEventListener("keydown", onModalKeydown);
    });
});

function closeModal() {
    modal.hidden = true;
    document.removeEventListener("keydown", onModalKeydown);
    if (lastFocusedEl) lastFocusedEl.focus();
}

function onModalKeydown(event) {
    if (event.key === "Escape") closeModal();
}

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", function (event) {
    if (event.target === modal) closeModal();
});


// ===== Нагодувати мавпочку =====
const feedBtn = document.getElementById("feedBtn");
const feedCount = document.getElementById("feedCount");
const avatar = document.querySelector(".avatar");

const feedMessages = [
    "Смачно!",
    "Мавпочка задоволена 🍌",
    "Ще одну, будь ласка!",
    "Ням-ням!",
    "Мавпочка танцює від щастя!"
];

let bananas = Number(localStorage.getItem("bananas") || 0);
feedCount.textContent = "З'їдено бананів: " + bananas;

feedBtn.addEventListener("click", function () {
    bananas++;
    localStorage.setItem("bananas", String(bananas));

    const message = feedMessages[Math.min(bananas - 1, feedMessages.length - 1)];
    feedCount.textContent = "З'їдено бананів: " + bananas + " — " + message;

    avatar.classList.remove("bounce");
    void avatar.offsetWidth; // перезапуск анімації
    avatar.classList.add("bounce");
});


// ===== Кнопка "нагору" =====
const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", function () {
    topBtn.classList.toggle("show", window.scrollY > 400);
});

topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
});


// ===== Форма контактів (валідація без alert) =====
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

const fields = {
    name: {
        input: document.getElementById("name"),
        error: document.getElementById("nameError"),
        validate: function (value) {
            return value.trim().length >= 2 ? "" : "Введіть ім'я (мінімум 2 символи).";
        }
    },
    email: {
        input: document.getElementById("email"),
        error: document.getElementById("emailError"),
        validate: function (value) {
            const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return pattern.test(value.trim()) ? "" : "Введіть коректний email.";
        }
    },
    message: {
        input: document.getElementById("message"),
        error: document.getElementById("messageError"),
        validate: function (value) {
            return value.trim().length >= 5 ? "" : "Повідомлення надто коротке.";
        }
    }
};

function validateField(field) {
    const errorMessage = field.validate(field.input.value);
    field.error.textContent = errorMessage;
    field.input.classList.toggle("invalid", Boolean(errorMessage));
    return errorMessage === "";
}

Object.values(fields).forEach(function (field) {
    field.input.addEventListener("blur", function () { validateField(field); });
    field.input.addEventListener("input", function () {
        if (field.input.classList.contains("invalid")) validateField(field);
    });
});

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const allValid = Object.values(fields)
        .map(validateField)
        .every(Boolean);

    if (!allValid) {
        formStatus.textContent = "Будь ласка, виправте помилки у формі.";
        return;
    }

    const name = fields.name.input.value.trim();
    formStatus.textContent = "Дякуємо, " + name + "! Ваше повідомлення надіслано.";
    form.reset();
    Object.values(fields).forEach(function (field) {
        field.error.textContent = "";
        field.input.classList.remove("invalid");
    });
});