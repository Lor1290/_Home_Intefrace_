"use strict";

import * as three from "https://cdn.skypack.dev/three@0.136.0";
import { GLTFLoader } from  "https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js";

const scene = new three.Scene();

const renderer = new three.WebGLRenderer( {alpha: true} );
const container3D = document.getElementById("container3D"); 

renderer.setSize(window.innerHeight, window.innerHeight);
container3D.appendChild(renderer.domElement);

const camera = new three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 8000);
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
const objToRender = "house_2__cute_series";


const loader = new GLTFLoader();
loader.load(
    `../models/${objToRender}/scene.gltf`,

    function (gltf) {
        object = gltf.scene;
        
        object.position.set(0, 0, 100);

        if(window.matchMedia("(max-width: 1080px)").matches) {
            camera.position.set(200, 250, 1000);
            object.scale.set(40, 35, 40);
        } else if(window.matchMedia("(max-width: 768px)").matches) {
            camera.position.set(200, 250, 650);
            object.scale.set(40, 35, 40);
        } else {
            camera.position.set(200, 250, 650);
            object.scale.set(50, 50, 50);   
        }

        object.rotation.y = 1.6;
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


const topLight = new three.DirectionalLight(0xffffff, 1);
topLight.position.set(100, 10, 10);

const ambientLight = new three.AmbientLight(0x333333, 1);

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