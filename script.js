function debounce(func, delay) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(func, delay);
    };
}

const debounceSendColorFromCMYK = debounce(function () {
    sendColorFromCMYK();
}, 500);
const debounceSendColorFromLAB = debounce(function () {
    sendColorFromLAB();
}, 500);
const debounceSendColorFromHSV = debounce(function () {
    sendColorFromHSV();
}, 500);

// Функции для синхронизации ползунков с полями CMYK
function syncCMYKSlider(inputId, sliderId) {
    document.getElementById(inputId).value = document.getElementById(sliderId).value;
    updateColorCircle(); // Обновляем цвет круга сразу
}

// Функции для синхронизации ползунков с полями LAB
function syncLABSlider(inputId, sliderId) {
    document.getElementById(inputId).value = document.getElementById(sliderId).value;
}

// Функции для синхронизации ползунков с полями HSV
function syncHSVSlider(inputId, sliderId) {
    document.getElementById(inputId).value = document.getElementById(sliderId).value;
}

// Функция отправки данных на сервер для CMYK
function sendColorFromCMYK() {
    const c = document.getElementById("c").value;
    const m = document.getElementById("m").value;
    const y = document.getElementById("y").value;
    const k = document.getElementById("k").value;

    console.log(`Sending CMYK: C=${c}, M=${m}, Y=${y}, K=${k}`);

    fetch('/convert/cmyk', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({c: c, m: m, y: y, k: k}),
    })
    .then(response => response.json())
    .then(updateFields)
    .catch(error => console.error('Error:', error));
}

// Обновляем поля на основе данных с сервера
function updateFields(data) {
    // Обновляем поля CMYK
    document.getElementById("c").value = data.cmyk.c.toFixed(2);
    document.getElementById("m").value = data.cmyk.m.toFixed(2);
    document.getElementById("y").value = data.cmyk.y.toFixed(2);
    document.getElementById("k").value = data.cmyk.k.toFixed(2);

    // Обновляем цвет круга
    updateColorCircle();
}

// Функция обновления круга цвета
function updateColorCircle() {
    const c = parseFloat(document.getElementById("c").value);
    const m = parseFloat(document.getElementById("m").value);
    const y = parseFloat(document.getElementById("y").value);
    const k = parseFloat(document.getElementById("k").value);

    const r = Math.round(255 * (1 - c) * (1 - k));
    const g = Math.round(255 * (1 - m) * (1 - k));
    const b = Math.round(255 * (1 - y) * (1 - k));

    document.getElementById("colorDisplay").style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

// Функция обработки выбора цвета из палитры
function updateFromPicker() {
    const color = document.getElementById("colorPicker").value;
    document.getElementById("colorDisplay").style.backgroundColor = color;

    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    const k = 1 - Math.max(r / 255, g / 255, b / 255);
    const c = (1 - r / 255 - k) / (1 - k);
    const m = (1 - g / 255 - k) / (1 - k);
    const y = (1 - b / 255 - k) / (1 - k);

    document.getElementById("c").value = c.toFixed(2);
    document.getElementById("m").value = m.toFixed(2);
    document.getElementById("y").value = y.toFixed(2);
    document.getElementById("k").value = k.toFixed(2);

    sendColorFromCMYK();
}

window.onload = function () {
    sendColorFromCMYK();
};