"use strict"; // Attiva la modalità strict per una gestione più sicura degli errori

// Riferimenti agli elementi del DOM
let body = document.body;
let cookie_blinder = document.getElementById("cookie_blinder");
let form_box = document.getElementsByClassName("form-box")[0];
let input_voltage = document.getElementById("voltage_input");
let input_temperature = document.getElementById("temperature_input");
let form = document.getElementsByClassName("form")[0];
let temp_data = document.getElementById("h1_temp");
let volt_data = document.getElementById("h1_watt");

// Aggiunge un listener per l'evento di submit del form
form.addEventListener("submit", function(event) {
    // Preleva i valori inseriti dall'utente
    let voltage = input_voltage.value;
    let temperature = input_temperature.value;

    // Imposta la durata dei cookie a 6 ore (in secondi)
    let sixHours = 6 * 60 * 60;

    // Salva i valori nei cookie con durata specificata
    document.cookie = "voltage=" + voltage + "; path=/; max-age=" + sixHours;
    document.cookie = "temperature=" + temperature + "; path=/; max-age=" + sixHours;

    // Nasconde il banner dei cookie una volta che l'utente ha inviato il form
    cookie_blinder.style.display = "none";
});

// Funzione per ottenere il valore di un cookie dato il nome
function getCookieValue(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

// Ottiene i valori dei cookie per 'voltage' e 'temperature'
let voltageCookie = getCookieValue("voltage");
let temperatureCookie = getCookieValue("temperature");

// Aggiunge un listener per l'evento DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    // Se i cookie esistono, aggiorna il contenuto degli elementi con i valori
    if (voltageCookie && temperatureCookie) {
        volt_data.innerText = Math.floor(parseFloat(voltageCookie) * 1000) + 12;
        temp_data.innerText = parseFloat(temperatureCookie);
        cookie_blinder.style.display = "none"; // Nasconde il banner dei cookie
    } else {
        // Se i cookie non esistono, mostra il banner dei cookie e impedisce lo scroll
        console.log("NO COOKIE");
        body.style.overflow = "hidden";
        cookie_blinder.style.display = "flex";
        form_box.style.display = "block";
    }
});