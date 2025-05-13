"use strict"; // Abilita la modalità rigorosa per una maggiore sicurezza del codice

// Importazioni da Three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Crea una nuova scena 3D
const scene = new THREE.Scene();

// Recupera l'elemento HTML dove verrà inserito il canvas WebGL
const container3D = document.getElementById("container3D");

// Inizializza il renderer con sfondo trasparente
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerHeight, window.innerHeight); // Imposta le dimensioni iniziali

// Aggiunge il canvas del renderer al DOM
container3D.appendChild(renderer.domElement);

// Crea una camera prospettica
const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  8000
);
camera.position.z = 1000; // Posizione iniziale lungo l’asse Z

// Crea i controlli orbitanti (per navigare la scena con il mouse)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false; // Disattiva il pan (spostamento laterale)
controls.enableDamping = true; // Attiva lo smorzamento per movimenti fluidi
controls.minDistance = 500;
controls.maxDistance = 600;
controls.maxPolarAngle = controls.minPolarAngle = Math.PI / 3; // Blocca l’inclinazione verticale
controls.target.set(10, 0, 10); // Punto di interesse per la camera
controls.update(); // Applica le modifiche ai controlli

// Variabili globali per oggetto e scala
let object;
let x, y, z;

// Funzione per impostare la scala in base alla larghezza dello schermo
function change_x_y_x() {
    if (screen.width < 760) {
        x = 40; y = 40; z = 40;
    } else if (screen.width < 1080) {
        x = 50; y = 50; z = 50;
    } else {
        x = 60; y = 60; z = 60;
    }
}

// Caricamento del modello 3D GLTF dalla cartella "house"
const loader = new GLTFLoader().setPath("./assets/house/");
loader.load(
    'scene.glb', // Nome del file da caricare

    function (gltf) {
        // Callback al completamento del caricamento
        change_x_y_x(); // Imposta la scala dell’oggetto

        object = gltf.scene;
        object.position.set(0, 0, 100); // Posizione iniziale del modello
        object.scale.set(x, y, z); // Applica la scala dinamica

        // Posizione della camera per inquadrare meglio il modello
        camera.position.set(200, 250, 650);
        camera.lookAt(10, 10, 70); // Punta la camera verso un punto preciso

        scene.add(object); // Aggiunge il modello alla scena
    },

    // Callback di progresso (caricamento in %)
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + " %loaded");
    },

    // Callback in caso di errore
    function (error) {
        console.error(error);
    }
);

// Crea e aggiunge una luce ambientale chiara alla scena
const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Luce bianca intensa
scene.add(ambientLight);

// Gestisce il ridimensionamento della finestra del browser
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); // Aggiorna la proiezione della camera
    renderer.setSize(window.innerWidth, window.innerHeight); // Aggiorna le dimensioni del renderer
});

// Funzione di animazione ricorsiva
function animate() {
    controls.update(); // Aggiorna i controlli orbitanti
    requestAnimationFrame(animate); // Richiede il prossimo frame
    renderer.render(scene, camera); // Renderizza la scena
}

animate(); // Avvia il ciclo di animazione
