"use strict"; // Attiva modalità 'strict' per migliorare la gestione degli errori

// Importazione dei moduli Three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Crea una nuova scena 3D
const scene = new THREE.Scene();

// Seleziona il contenitore HTML dove inserire il canvas WebGL
const container3D = document.getElementById("container3D");

// Inizializza il renderer con sfondo trasparente
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerHeight, window.innerHeight); // Imposta dimensioni iniziali

// Inserisce il canvas nel DOM
container3D.appendChild(renderer.domElement);

// Crea la camera prospettica
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 8000);
camera.position.z = 1000; // Posizione iniziale lungo l'asse Z

// Configura i controlli per navigare la scena
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false; // Disabilita il pan laterale
controls.enableDamping = true; // Smorzamento per movimenti più naturali
controls.minDistance = 500;
controls.maxDistance = 800;
controls.maxPolarAngle = controls.minPolarAngle = Math.PI / 3; // Limita la rotazione verticale
controls.target.set(10, 0, 10); // Punto centrale della scena
controls.update(); // Applica modifiche

// Variabili globali per l'oggetto, scala e luci
let object;
let x, y, z;
let lights = 0x000000; // Stato iniziale della luce (spenta)

// Funzione per regolare la scala dell'oggetto in base alla larghezza dello schermo
function change_x_y_x() {
    if (screen.width < 760) {
        x = 80; y = 120; z = 80;
    } else if (screen.width < 1080) {
        x = 100; y = 100; z = 100;
    } else {
        x = 130; y = 130; z = 130;
    }
}

// Carica il modello GLTF della "camera da letto"
const loader = new GLTFLoader().setPath("../../assets/bedroom/");
loader.load(
    `scene.glb`, // Nome del file

    function (gltf) {
        // Callback al completamento del caricamento
        change_x_y_x(); // Imposta scala dell’oggetto

        object = gltf.scene;
        object.rotation.y = 1.5; // Rotazione dell’oggetto
        object.scale.set(x, y, z); // Applica scala

        // Posizione dell’oggetto in base alla risoluzione
        if (screen.width < 760) {
            object.position.set(-100, -80, 0);
        } else if (screen.width < 1080) {
            object.position.set(-100, -60, 0);
        } else {
            object.position.set(-100, 0, 0);
        }

        // Ottimizzazione dei materiali dell'oggetto
        object.traverse((child) => {
            if (child.isMesh) {
                if (child.material.isMeshStandardMaterial) {
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

        // Abilita ombre
        object.castShadow = true;
        object.receiveShadow = true;

        // Riposiziona la camera per inquadrare meglio la scena
        camera.position.set(200, 200, -50);
        camera.lookAt(10, 10, 70);

        // Aggiunge l’oggetto alla scena
        scene.add(object);
    },

    // Callback per visualizzare lo stato di caricamento
    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + " %loaded");
    },

    // Callback in caso di errore durante il caricamento
    function (error) {
        console.error(error);
    }
);

// Aggiunge luce ambientale iniziale (morbida, grigia)
const ambientLight = new THREE.AmbientLight(0x888888, 1);
scene.add(ambientLight);

// Gestione del resize per mantenere il canvas responsivo
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Funzione di animazione continua (loop di rendering)
function animate() {
    controls.update();              // Aggiorna i controlli orbitanti
    requestAnimationFrame(animate); // Richiede il prossimo frame
    renderer.render(scene, camera); // Renderizza la scena
}

animate(); // Avvia il ciclo

// Gestione checkbox per accensione/spegnimento della luce ambientale
const checks_light = document.getElementById("open_light");
checks_light.addEventListener("click", (e) => {
    const checkbox = e.target;

    if (checkbox.checked) {
        lights = 0x888888; // Luce accesa (grigio chiaro)
    } else {
        lights = 0x000000; // Luce spenta
    }

    ambientLight.color.set(lights); // Aggiorna colore della luce ambientale
});
