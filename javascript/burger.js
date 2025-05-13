"use strict"; // Modalità rigorosa: aiuta a evitare errori comuni

// Seleziona l'elemento con id "burger" (menu hamburger)
let burger = document.getElementById("burger");

// Aggiunge un event listener al click sull'icona burger
burger.addEventListener("click", () => {    

    // Alterna la classe "change" per animare l'icona (es. trasformazione in X)
    burger.classList.toggle("change");

    // Seleziona il menu a tendina (link visibili al click)
    let drop_down = document.getElementById("burger_links");

    // Seleziona il primo elemento <nav> presente nella pagina
    let nav = document.getElementsByTagName("nav")[0];

    // Verifica se il menu a tendina è già visibile
    if (drop_down.style.display === "block") {
        // Nasconde il menu se era visibile
        drop_down.style.display = "none";   
    } else { 
        // Mostra il menu
        drop_down.style.display = "block";

        // Posiziona il menu immediatamente sotto il <nav>
        drop_down.style.top = nav.offsetHeight + "px";
    }    
});
