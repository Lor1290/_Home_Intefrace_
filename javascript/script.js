"use strict";

let burger = document.getElementById("burger");

const checks = document.getElementsByClassName("cb");
const images = document.getElementsByClassName("switch_on");

let all = [];

for(let x = 0; x < checks.length; x++) {
    all.push([checks[x], images[x]]);
}

for(let x = 0; x < checks.length; x++) {
    all[x][0].addEventListener("click", change);
}

change = (e) => {
    const checkbox = e.target;
    const index = Array.from(checks).indexOf(checkbox);
    const image = all[index][1];
    
    if(checkbox.checked) {
        image.style.display = "block";
    } else {
        
    }
}

burger.addEventListener("click", () => {    
    burger.classList.toggle("change");

    let drop_down = document.getElementById("burger_links");
    let nav = document.getElementsByTagName("nav")[0];

    if(drop_down.style.display === "block") {
        drop_down.style.display = "none";   
    } else { 
        drop_down.style.display = "block";
        drop_down.style.top = nav.offsetHeight + "px";
    }    

});