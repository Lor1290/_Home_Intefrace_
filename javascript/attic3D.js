"use strict"; // Modalità strict per evitare errori comuni e abilitare una sintassi più sicura

// Importazione delle librerie necessarie di Three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Creazione della scena 3D
const scene = new THREE.Scene();

// Selettore del contenitore HTML per il rendering 3D
const container3D = document.getElementById("container3D"); 

// Creazione del renderer WebGL con sfondo trasparente (alpha: true)
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerHeight, window.innerHeight); // Imposta dimensioni del renderer
container3D.appendChild(renderer.domElement); // Aggiunge il canvas al DOM

// Impostazione della camera prospettica
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 8000);
camera.position.z = 1000; // Posizione iniziale della camera

// Controlli dell'orbita della camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;            // Disabilita il pan
controls.enableDamping = true;         // Abilita effetto di smorzamento
controls.minDistance = 500;            // Distanza minima della camera
controls.maxDistance = 800;            // Distanza massima della camera
controls.maxPolarAngle = controls.minPolarAngle = Math.PI / 3; // Blocca la rotazione verticale
controls.target.set(10, 0, 10);        // Punto di interesse della camera
controls.update();                     // Aggiorna i controlli

// Variabili globali per oggetto 3D e scala
let object;
let x, y, z;
let lights = 0x000000; // Colore iniziale della luce ambientale

// Funzione per definire la scala dell’oggetto 3D in base alla dimensione dello schermo
function change_x_y_x() {
    if (screen.width < 760) {
        x = 57;
        y = 57;
        z = 57;
    } else if (screen.width < 1080) {
        x = 85;
        y = 70;
        z = 70;
    } else {
        x = 88;
        y = 88;
        z = 88;
    }
}

// Caricamento del modello GLB usando GLTFLoader
const loader = new GLTFLoader().setPath("../../assets/attic/");
loader.load(
    `scene.glb`, // Nome del file

    function (gltf) {
        // Callback al completamento del caricamento
        change_x_y_x(); // Imposta scala in base alla dimensione dello schermo

        object = gltf.scene; // Ottiene la scena dal file glTF
        object.rotation.y = 9.4; // Ruota l’oggetto lungo l’asse Y
        object.scale.set(x, y, z); // Imposta la scala

        // Imposta la posizione in base allo schermo
        if (screen.width < 1080) {
            object.position.set(0, -30, -20);
        } else {
            object.position.set(0, -30, 10);
        }

        // Per ogni mesh nel modello: migliora materiali
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

        // Abilita ombre
        object.castShadow = true;
        object.receiveShadow = true;

        // Nuova posizione della camera per vedere meglio l'oggetto
        camera.position.set(200, 200, -50);
        camera.lookAt(10, 10, 70);

        scene.add(object); // Aggiunge l’oggetto alla scena
    },

    // Callback per monitorare il caricamento del modello
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + " %loaded");
    },

    // Callback in caso di errore nel caricamento
    function (error) {
        console.error(error);
    }
);

// Aggiunta di una luce ambientale alla scena
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); // Luce bianca intensa
scene.add(ambientLight);

// Gestione del resize della finestra per adattare camera e renderer
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Funzione di animazione che aggiorna e ridisegna continuamente la scena
function animate() {
    controls.update(); // Aggiorna i controlli per l’effetto di smorzamento
    requestAnimationFrame(animate); // Chiede il prossimo frame
    renderer.render(scene, camera); // Renderizza la scena
}

animate(); // Avvia l’animazione

// Gestione interattiva della luce ambientale tramite checkbox HTML
const checks_light = document.getElementById("open_light");
checks_light.addEventListener("click", (e) => {
    const checkbox = e.target;

    // Cambia il colore della luce in base allo stato del checkbox
    if (checkbox.checked) {
        lights = 0xffffff; // Luce accesa
    } else {
        lights = 0x333333; // Luce tenue/spenta
    }

    ambientLight.color.set(lights); // Applica il nuovo colore alla luce ambientale
});
