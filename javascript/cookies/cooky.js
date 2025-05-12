"use strict";

let body = document.body;
let cookie_blinder = document.getElementById("cookie_blinder");
let form_box = document.getElementsByClassName("form-box")[0];

let input_voltage = document.getElementById("voltage_input");
let input_temperature = document.getElementById("temperature_input");
let form = document.getElementsByClassName("form")[0];

let temp_data = document.getElementById("h1_temp");
let volt_data = document.getElementById("h1_watt");


form.addEventListener("submit", function(event) {

    let voltage = input_voltage.value;
    let temperature = input_temperature.value;

    let sixHours = 6 * 60 * 60; 
    document.cookie = "voltage=" + voltage + "; path=/; max-age=" + sixHours;
    document.cookie = "temperature=" + temperature + "; path=/; max-age=" + sixHours;

    cookie_blinder.style.display = "none";

});    

function getCookieValue(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

let voltageCookie = getCookieValue("voltage");
let temperatureCookie = getCookieValue("temperature");


document.addEventListener("DOMContentLoaded", () => {
    volt_data.innerText = Math.floor(parseFloat(voltageCookie)*1000) + 12;
    temp_data.innerText = parseFloat(temperatureCookie);
});

if (voltageCookie && temperatureCookie) {
    cookie_blinder.style.display = "none";
    
} else {
    console.log("NO COOKIE");
    body.style.overflow = "hidden";
    cookie_blinder.style.display = "flex";
    form_box.style.display = "block";
}