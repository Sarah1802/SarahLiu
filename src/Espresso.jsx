import * as THREE from 'https://cdn.jsdelivr.net/npm/three@latest/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@latest/examples/jsm/loaders/GLTFLoader.js';

export function Espresso() {
     // Scene setup
     const scene = new THREE.Scene();
     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
     const renderer = new THREE.WebGLRenderer();
     renderer.setSize(window.innerWidth, window.innerHeight);
     document.body.appendChild(renderer.domElement);
 
     // Add light
     const light = new THREE.DirectionalLight(0xffffff, 1);
     light.position.set(5, 5, 5).normalize();
     scene.add(light);
 
     // Load 3D model
     const loader = new GLTFLoader();
     loader.load('/../docs/latte.glb', (gltf) => {
       scene.add(gltf.scene);
     }, undefined, (error) => {
       console.error('An error occurred while loading the model:', error);
     });
 
     // Camera position
     camera.position.z = 5;
 
     // Animation loop
     function animate() {
       requestAnimationFrame(animate);
       renderer.render(scene, camera);
     }

     animate();

}