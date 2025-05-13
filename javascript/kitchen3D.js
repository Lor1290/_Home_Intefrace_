"use strict"; // Attiva la modalità rigorosa per evitare errori silenziosi

// Importa i moduli di Three.js necessari per la scena 3D, i controlli e il caricamento del modello
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Crea una nuova scena
const scene = new THREE.Scene();

// Recupera il contenitore HTML dove verrà aggiunto il canvas 3D
const container3D = document.getElementById("container3D");

// Inizializza il renderer con trasparenza
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerHeight, window.innerHeight); // Imposta le dimensioni iniziali

// Aggiunge il canvas alla pagina
container3D.appendChild(renderer.domElement);

// Crea una camera prospettica
const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  8000
);
camera.position.z = 1000; // Posizione iniziale della camera

// Inizializza i controlli orbitanti per interazione utente
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false; // Disabilita lo spostamento laterale
controls.enableDamping = true; // Abilita smorzamento dei movimenti
controls.minDistance = 500;
controls.maxDistance = 800;
controls.maxPolarAngle = controls.minPolarAngle = Math.PI / 3; // Blocca l'inclinazione verticale
controls.target.set(10, 0, 10); // Punto verso cui guarda la camera
controls.update();

// Variabili per l’oggetto 3D e la sua scala
let object;
let x, y, z;

// Colore luce di default
let lights = 0x000000;

// Funzione per adattare la scala del modello alla dimensione dello schermo
function change_x_y_x() {
    if (screen.width < 760) {
        x = 50; y = 60; z = 60;
    } else if (screen.width < 1080) {
        x = 50; y = 60; z = 60;
    } else {
        x = 90; y = 80; z = 80;
    }
}

// Carica il modello della cucina da una cartella relativa
const loader = new GLTFLoader().setPath("../../assets/kitchen/");
loader.load(
    'scene.glb', // File GLB da caricare

    function (gltf) {
        // Callback quando il modello è stato caricato
        change_x_y_x(); // Applica la scala in base alla risoluzione

        object = gltf.scene;
        object.rotation.y = 2.2; // Rotazione del modello
        object.scale.set(x, y, z); // Applica la scala

        // Posiziona il modello in modo diverso a seconda della risoluzione
        if (screen.width < 760) {
            object.position.set(-100, 0, -50);
        } else if (screen.width < 1080) {
            object.position.set(-100, 0, -60);
        } else {
            object.position.set(-100, 0, -100);
        }

        // Ottimizza i materiali del modello per l’illuminazione
        object.traverse((child) => {
            if (child.isMesh) {
                if (child.material.isMeshStandardMaterial) {
                    child.material.metalness = 0.1;
                    child.material.roughness = 0.1;
                } else {
                    child.material = new THREE.MeshStandardMaterial({
                        color: child.material.color || 0xffffff,
                        metalness: 0.1,
                        roughness: 0.1,
                    });
                }
            }
        });

        // Abilita le ombre
        object.castShadow = true;
        object.receiveShadow = true;

        // Riposiziona la camera per inquadrare bene il modello
        camera.position.set(200, 200, -50);
        camera.lookAt(10, 10, 70);

        // Aggiunge il modello alla scena
        scene.add(object);
    },

    // Callback per mostrare il progresso del caricamento
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + " %loaded");
    },

    // Callback in caso di errore nel caricamento
    function (error) {
        console.error(error);
    }
);

// Crea e aggiunge una luce ambientale iniziale (bianca, intensità 1)
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Gestione del resize della finestra: mantiene il canvas adattato
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); // Aggiorna la matrice di proiezione
    renderer.setSize(window.innerWidth, window.innerHeight); // Aggiorna la dimensione del renderer
});

// Funzione di animazione continua (render loop)
function animate() {
    controls.update(); // Aggiorna i controlli per smorzamento
    requestAnimationFrame(animate); // Chiede il prossimo frame
    renderer.render(scene, camera); // Disegna la scena
}

animate(); // Avvia il ciclo di animazione

// Gestisce il click sul checkbox per accendere/spegnere la luce
const checks_light = document.getElementById("open_light");
checks_light.addEventListener("click", (e) => {
    const checkbox = e.target;

    // Cambia il colore della luce ambientale in base allo stato del checkbox
    if (checkbox.checked) {
        lights = 0xffffff; // Luce accesa (bianco)
    } else {
        lights = 0x666666; // Luce attenuata (grigio scuro)
    }

    ambientLight.color.set(lights); // Applica il nuovo colore
});
