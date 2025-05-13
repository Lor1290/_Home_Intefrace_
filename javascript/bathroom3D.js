"use strict"; // Attiva la modalità rigorosa per una scrittura di codice più sicura

// Importazione dei moduli da Three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Creazione della scena principale
const scene = new THREE.Scene();

// Riferimento al contenitore HTML in cui inserire il canvas WebGL
const container3D = document.getElementById("container3D");

// Creazione del renderer con sfondo trasparente
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerHeight, window.innerHeight); // Imposta dimensione iniziale del canvas

// Aggiunta del canvas al DOM
container3D.appendChild(renderer.domElement);

// Creazione della camera con prospettiva
const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  8000
);
camera.position.z = 1000; // Posizione iniziale della camera

// Configurazione dei controlli orbitanti della camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;               // Disattiva il panning (movimento laterale)
controls.enableDamping = true;           // Attiva lo smorzamento per movimenti fluidi
controls.minDistance = 500;              // Distanza minima dal target
controls.maxDistance = 800;              // Distanza massima dal target
controls.maxPolarAngle = controls.minPolarAngle = Math.PI / 3; // Blocca la rotazione verticale
controls.target.set(10, 0, 10);          // Punto verso cui guarda la camera
controls.update();                       // Applica le modifiche

// Variabili globali
let object;       // Oggetto 3D caricato
let x, y, z;      // Fattori di scala
let lights = 0x000000; // Colore iniziale della luce (spenta)

// Funzione che imposta scala dell'oggetto in base alla larghezza dello schermo
function change_x_y_x() {
    if (screen.width < 760) {
        x = 15; y = 20; z = 20;
    } else if (screen.width < 1080) {
        x = 20; y = 20; z = 20;
    } else {
        x = 25; y = 25; z = 25;
    }
}

// Caricatore GLTF configurato per cercare file nella cartella "bathroom"
const loader = new GLTFLoader().setPath("../../assets/bathroom/");

loader.load(
    `scene.glb`, // File del modello 3D

    function (gltf) {
        // Quando il modello è stato caricato
        change_x_y_x(); // Imposta la scala in base alla dimensione dello schermo

        object = gltf.scene; // Recupera la scena del modello
        object.rotation.y = 1.5; // Rotazione iniziale dell’oggetto
        object.scale.set(x, y, z); // Imposta la scala

        // Imposta la posizione dell’oggetto in base alla dimensione dello schermo
        if (screen.width < 760) {
            object.position.set(-10, -50, 50);
        } else if (screen.width < 1080) {
            object.position.set(-10, 0, 105);
        } else {
            object.position.set(-10, 0, 100);
        }

        // Per ogni oggetto nella scena, migliora il materiale se è una mesh
        object.traverse((child) => {
            if (child.isMesh) {
                if (child.material.isMeshStandardMaterial) {
                    // Modifica i parametri del materiale esistente
                    child.material.metalness = 0.1;
                    child.material.roughness = 0.1;
                } else {
                    // Sostituisce il materiale con uno standard
                    child.material = new THREE.MeshStandardMaterial({
                        color: child.material.color || 0xffffff,
                        metalness: 0.1,
                        roughness: 0.1,
                    });
                }
            }
        });

        // Abilita ombre per l’oggetto
        object.castShadow = true;
        object.receiveShadow = true;

        // Sposta la camera per inquadrare meglio il modello
        camera.position.set(200, 200, -50);
        camera.lookAt(10, 10, 70);

        // Aggiunge il modello 3D alla scena
        scene.add(object);
    },

    function (xhr) {
        // Log di avanzamento caricamento
        console.log((xhr.loaded / xhr.total) * 100 + " %loaded");
    },

    function (error) {
        // Gestione errori nel caricamento
        console.error(error);
    }
);

// Aggiunge una luce ambientale morbida alla scena
const ambientLight = new THREE.AmbientLight(0xdddddd, 1); // luce grigio chiaro
scene.add(ambientLight);

// Evento: aggiorna dimensione della finestra e camera al resize
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Funzione di rendering ricorsivo (loop di animazione)
function animate() {
    controls.update();              // Aggiorna i controlli
    requestAnimationFrame(animate); // Richiama se stessa al frame successivo
    renderer.render(scene, camera); // Renderizza la scena
}

animate(); // Avvia il ciclo di animazione

// Gestione checkbox per accensione/spegnimento della luce ambientale
const checks_light = document.getElementById("open_light");
checks_light.addEventListener("click", (e) => {
    const checkbox = e.target;

    // Cambia il colore della luce in base allo stato della checkbox
    if (checkbox.checked) {
        lights = 0xdddddd; // Luce accesa
    } else {
        lights = 0x333333; // Luce soffusa/spenta
    }

    // Applica il nuovo colore alla luce ambientale
    ambientLight.color.set(lights);
});
