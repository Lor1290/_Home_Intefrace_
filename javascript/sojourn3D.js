"use strict"; // Abilita la modalità rigorosa per una scrittura più sicura del codice

// Importa moduli da Three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// === SCENA, RENDERER, CAMERA ===

// Crea la scena 3D
const scene = new THREE.Scene();

// Prende il contenitore HTML dove inserire la scena
const container3D = document.getElementById("container3D"); 

// Inizializza il renderer con sfondo trasparente
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerHeight, window.innerHeight);

// Aggiunge il canvas generato dal renderer al DOM
container3D.appendChild(renderer.domElement);

// Crea la camera prospettica
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 8000);
camera.position.z = 1000; // Posiziona la camera lungo l'asse Z

// Aggiunge controlli orbitali (rotazione interattiva)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;                // Disabilita panning
controls.enableDamping = true;             // Smorzamento per movimenti più fluidi
controls.minDistance = 500;                // Zoom minimo
controls.maxDistance = 800;                // Zoom massimo
controls.maxPolarAngle = controls.minPolarAngle = Math.PI/3; // Blocca rotazione verticale
controls.target.set(10, 0, 10);            // Punto su cui la camera guarda
controls.update();                         // Applica le modifiche

// === VARIABILI DI STATO ===
let object;     // Il modello 3D caricato
let x, y, z;    // Variabili per scala dinamica
let lights = 0x000000; // Valore iniziale della luce (spenta)

// === Funzione per cambiare la scala del modello in base alla larghezza schermo ===
function change_x_y_x() {
    if (screen.width < 760) {
        x = 100; y = 130; z = 100;
    } else if (screen.width < 1080) {
        x = 120; y = 120; z = 120;
    } else {
        x = 140; y = 140; z = 140;
    }
}

// === CARICAMENTO MODELLO GLTF ===
const loader = new GLTFLoader().setPath("../../assets/living_room/");
loader.load(
    'scene.glb', // Nome file

    function (gltf) {
        change_x_y_x(); // Imposta la scala

        object = gltf.scene;
        object.position.set(-100, 0, 80);   // Posizione iniziale
        object.rotation.y = 2.1;            // Rotazione sull’asse Y
        object.scale.set(x, y, z);          // Applica scala dinamica

        // Applica proprietà materiali ai mesh trovati nel modello
        object.traverse((child) => {
            if (child.isMesh) {
                if (child.material.isMeshStandardMaterial) {
                    child.material.metalness = 0.1;
                    child.material.roughness = 0.1;
                } else {
                    // Sostituisce materiali non standard
                    child.material = new THREE.MeshStandardMaterial({
                        color: child.material.color || 0xffffff,
                        metalness: 0.1,
                        roughness: 0.1,
                    });
                }
            }
        });

        object.castShadow = true;
        object.receiveShadow = true;

        // Posiziona e orienta la camera verso l’oggetto
        camera.position.set(200, 200, -50);
        camera.lookAt(10, 10, 70);

        // Aggiunge il modello alla scena
        scene.add(object);
    },

    function (xhr) {
        // Callback per il caricamento progressivo
        console.log((xhr.loaded / xhr.total) * 100 + " %loaded");
    },

    function (error) {
        // Gestione errori di caricamento
        console.error(error);
    }
);

// === LUCE AMBIENTE ===
const ambientLight = new THREE.AmbientLight(0x333333, 1); // Luce fioca iniziale
scene.add(ambientLight);

// === ADATTAMENTO AL RIDIMENSIONAMENTO DELLA FINESTRA ===
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// === LOOP DI ANIMAZIONE ===
function animate() {
    controls.update();             // Aggiorna i controlli
    requestAnimationFrame(animate); // Chiama se stessa continuamente
    renderer.render(scene, camera); // Disegna la scena
};
animate();

// === INTERAZIONE CON LUCE ===
const checks_light = document.getElementById("open_light");
checks_light.addEventListener("click", (e) => {
    const checkbox = e.target;

    if (checkbox.checked) {
        lights = 0x333333; // Accende luce ambientale
    } else {
        lights = 0x000000; // Spegne
    }

    ambientLight.color.set(lights); // Applica il nuovo colore della luce
});
