"use strict";

let temperature;
let watt = 0;

const checks_light = document.getElementById("open_light");
const checks_door = document.getElementById("open_door");
const checks_lock = document.getElementById("open_lock");
const check_camera = document.getElementById("open_camera");
const check_termos = document.getElementById("open_termos");

const images_light = document.getElementById("switch_on");
const images_door = document.getElementById("door_on"); 
const images_lock = document.getElementById("lock_on");

const temp_header = document.getElementById("h1_temp");
const hour_header = document.getElementById("h1_hour");
const watt_header = document.getElementById("h1_watt");

const default_off = "../../img/lights_off.png";
const default_on = "../../img/light_on.png";    
const default_door_off = "../../img/door_closed.png";
const default_door_on = "../../img/door_open.png";
const default_lock_off = "../../img/unblock.png"
const default_lock_on = "../../img/block.png"

const slider = document.querySelector(".slider .level");


checks_light.addEventListener("click", (e) => {
    const checkbox = e.target;  
    
    if(checkbox.checked) {
        images_light.src = default_on;
        watt = 12;
    } else {
        images_light.src = default_off;
        watt = -12;
    }

    change_watt();
});
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
check_camera.addEventListener("click", (e) => {
    const checkbox = e.target;

    if(checkbox.checked) {
        watt = 16;
    } else {
        watt = -16;
    }

    change_watt();
});
check_termos.addEventListener("click", (e) => {
    const checkbox = e.target;

    if(checkbox.checked) {
        watt = 5;
    } else {
        watt = -5;
    }

    change_watt();
});


function change_watt() {
    watt_header.innerText = Number.parseInt(watt_header.innerText || 0)+watt;
}

slider.addEventListener("input", () => {
    temp_header.innerText = slider.value;
    
    if( Math.abs(slider.value) - 20 > 10) 
        watt = 10;
    else 
        watt = 5;
});
setInterval(function update_time() {
    let d = new Date();
    let time = d.getHours() + ":" + d.getMinutes();
    hour_header.innerText = time;
});