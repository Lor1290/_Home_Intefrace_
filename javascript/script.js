"use strict"; // Attiva la modalità rigorosa di JavaScript

// Variabili globali
let temperature; // La temperatura corrente (valore impostato dallo slider)
let watt = 0;     // Consumo energetico (in Watt)

// Elementi DOM (checkbox)
const checks_light = document.getElementById("open_light");
const checks_door = document.getElementById("open_door");
const checks_lock = document.getElementById("open_lock");
const check_camera = document.getElementById("open_camera");
const check_termos = document.getElementById("open_termos");

// Immagini da aggiornare in base agli stati
const images_light = document.getElementById("switch_on");
const images_door = document.getElementById("door_on"); 
const images_lock = document.getElementById("lock_on");

// Output dove aggiornare valori in pagina
const temp_header = document.getElementById("h1_temp");
const hour_header = document.getElementById("h1_hour");
const watt_header = document.getElementById("h1_watt");

// Percorsi immagini per gli stati ON/OFF
const default_off = "../../img/lights_off.png";
const default_on = "../../img/light_on.png";    
const default_door_off = "../../img/door_closed.png";
const default_door_on = "../../img/door_open.png";
const default_lock_off = "../../img/unblock.png"
const default_lock_on = "../../img/block.png"

// Slider per regolare la temperatura
const slider = document.querySelector(".slider .level");

// === EVENTI ===

// LUCI
checks_light.addEventListener("click", (e) => {
    const checkbox = e.target;

    if(checkbox.checked) {
        images_light.src = default_on; // cambia immagine
        watt = 12; // consumo positivo
    } else {
        images_light.src = default_off;
        watt = -12; // rimuove consumo
    }

    change_watt(); // aggiorna valore in pagina
});

// PORTA
checks_door.addEventListener("click", (e) => {
    const checkbox = e.target;

    if(checkbox.checked) {
        images_door.src = default_door_on;
        watt = 50;
    } else {
        images_door.src = default_door_off;
        watt = -50;
    }

    change_watt();
});

// SERRATURA
checks_lock.addEventListener("click", (e) => {
    const checkbox = e.target;

    if(checkbox.checked) {
        images_lock.src = default_lock_on;
        watt = 2;
    } else {
        images_lock.src = default_lock_off;
        watt = -2;
    }

    change_watt();
});

// VIDEOCAMERA
check_camera.addEventListener("click", (e) => {
    const checkbox = e.target;

    if(checkbox.checked) {
        watt = 16;
    } else {
        watt = -16;
    }

    change_watt();
});

// TERMOSTATO
check_termos.addEventListener("click", (e) => {
    const checkbox = e.target;

    if(checkbox.checked) {
        watt = 5;
    } else {
        watt = -5;
    }

    change_watt();
});

// === FUNZIONI ===

// Aggiorna il valore totale dei Watt mostrato nella pagina
function change_watt() {
    watt_header.innerText = parseInt(watt_header.innerText || 0) + watt;
}

// Slider temperatura - aggiorna valore e consumo
slider.addEventListener("input", () => {
    temp_header.innerText = slider.value; // Mostra la temperatura attuale

    // Se la temperatura è molto diversa da 20, aumenta consumo
    if(Math.abs(slider.value) - 20 > 10) 
        watt = 2;
    else 
        watt = 1;

    change_watt();
});

// Aggiorna l'orario ogni secondo
setInterval(function update_time() {
    let d = new Date();
    let time = d.getHours() + ":" + d.getMinutes().toString().padStart(2, '0');
    hour_header.innerText = time;
});
