"use strict";

let burger = document.getElementById("burger");

burger.addEventListener("click", () => {    
    burger.classList.toggle("change");

    let drop_down = document.getElementById("burger_links");
    let nav = document.getElementsByTagName("nav")[0];

    if(drop_down.style.display === "block") 
        drop_down.style.display = "none";
        
    else 
        drop_down.style.display = "block";
        drop_down.style.top = nav.offsetHeight + "px";
});
