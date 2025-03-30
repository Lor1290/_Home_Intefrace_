"use strict";

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const container3D = document.getElementById("container3D"); 

const renderer = new THREE.WebGLRenderer( {alpha: true} );
renderer.setSize(window.innerHeight, window.innerHeight);

container3D.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 8000);
camera.position.z = 1000;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableDamping = true;
controls.minDistance = 500;
controls.maxDistance = 800;
controls.maxPolarAngle = controls.minPolarAngle = Math.PI/3;
controls.target.set(10, 0, 10);
controls.update();

let object;
let x, y, z;
let lights = 0x000000;

function change_x_y_x() {
    if(screen.width < 760 ) {
        x = 57;
        y = 57;
        z = 57;
    } else if(screen.width < 1080) {
        x = 85;
        y = 70;
        z = 70;
    } else {    
        x = 88;
        y = 88;
        z = 88;
    }   
}

const loader = new GLTFLoader().setPath("../../assets/attic/");
loader.load(
    `scene.glb`,

    function (gltf) {
        change_x_y_x();

        object = gltf.scene;
        object.rotation.y = 9.4;
        object.scale.set(x, y, z);  
        
        if(screen.width < 760) {
            object.position.set(0, -30, -20);
        } else if(screen.width < 1080) {
            object.position.set(0, -30, -20);
        } else {
            object.position.set(0, -30, 10);
        }   
        

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
        })

        object.castShadow = true;
        object.receiveShadow = true;

        camera.position.set(200, 200, -50);
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


const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
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


const checks_light = document.getElementById("open_light");
checks_light.addEventListener("click", (e) => {
    const checkbox = e.target;  
    
    if(checkbox.checked) {
        lights = 0xffffff;
    } else {
        lights = 0x333333;
    }

    ambientLight.color.set(lights);
});