"use strict";

let temperature;
let prev = 0;
let watt = 0;

const checks_light = document.getElementById("open_light");
const checks_door = document.getElementById("open_door");
const checks_lock = document.getElementById("open_lock");

const images_light = document.getElementById("switch_on");
const images_door = document.getElementById("door_on"); 
const images_lock = document.getElementById("lock_on");

const temp_header = document.getElementById("h1_temp");
const hour_header = document.getElementById("h1_hour");
const watt_header = document.getElementById("h1_watt");

checks_light.addEventListener("click", change_lights);
checks_door.addEventListener("click", change_door);
checks_lock.addEventListener("click", change_lock);

const default_off = "../../img/lights_off.png";
const default_on = "../../img/light_on.png";    

const default_door_off = "../../img/door_closed.png";
const default_door_on = "../../img/door_open.png";

const default_lock_off = "../../img/unblock.png"
const default_lock_on = "../../img/block.png"

const slider = document.querySelector(".slider .level");

function change_lights(e) {
    const checkbox = e.target;  
    
    if(checkbox.checked) {
        images_light.src = default_on;
        watt = 10;
    } else {
        images_light.src = default_off;
        watt = -10;
    }
}
function change_door(e) {
    const checkbox = e.target;

    if(checkbox.checked) {
        images_door.src = default_door_on;
    } else {
        images_door.src = default_door_off;
    }
}
function change_lock(e) {
    const checkbox = e.target;  

    if(checkbox.checked) {
        images_lock.src = default_lock_on;
    } else {
        images_lock.src = default_lock_off;
    }
}

function change_watt() {
    if(prev != watt) {
        watt_header += watt;
        prev = watt;
    }
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
