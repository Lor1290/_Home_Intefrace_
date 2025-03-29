"use strict";

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer( {alpha: true} );
const container3D = document.getElementById("container3D"); 

renderer.setSize(window.innerHeight, window.innerHeight);
container3D.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 8000);
camera.position.z = 1000;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableDamping = true;

controls.minDistance = 500;
controls.maxDistance = 600;

controls.maxPolarAngle = controls.minPolarAngle = Math.PI/3;

controls.target.set(10, 0, 10);
controls.update();

let object;
let x, y, z;

function change_x_y_x() {
    if(screen.width < 760 ) {
        x = 35;
        y = 35;
        z = 35;
    } else if(screen.width < 1080) {
        x = 40;
        y = 40;
        z = 40;
    } else {    
        x = 50;
        y = 50;
        z = 50;
    }   


}

const loader = new GLTFLoader().setPath("./assets/house");
loader.load(
    `scene.gltf`,

    function (gltf) {
        change_x_y_x();

        object = gltf.scene;
        object.position.set(0, 0, 100);
        object.scale.set(x, y, z);    
        object.rotation.y = 1.6;

        camera.position.set(200, 250, 650);
        camera.lookAt(10, 10, 70);

        scene.add(object);
    },

    function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + " %loaded");
    },

    function (error) {
        console.error(error);
    }
);


const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(100, 10, 10);

const ambientLight = new THREE.AmbientLight(0x333333, 1);

scene.add(topLight);
scene.add(ambientLight);

window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
    controls.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();