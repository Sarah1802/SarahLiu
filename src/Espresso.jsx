import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const ThreeDScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene, camera, and renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(8, 7, 0);
    camera.lookAt(1,0,0)
    const renderer = new THREE.WebGLRenderer({antialias:true});
    const axesHelper = new THREE.AxesHelper(10); // Size of the axes (10 units)
    scene.add(axesHelper);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true; // Enable shadows in the rendere
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
    mountRef.current.appendChild(renderer.domElement);

    // Scene background
    scene.background = new THREE.Color('white');


    // Light
    const ambient = new THREE.AmbientLight(0xffffff, 2); // Soft white light
    scene.add(ambient);

    const light = new THREE.DirectionalLight(0xffffff, 2.5);
    light.castShadow = true; // Enable shadow casting // The second argument is the intensity (higher = stronger)
    light.shadow.radius = 1;
    light.position.set(0, 2, 0).normalize();
    scene.add(light);

    const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
    const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 }); // Semi-transparent shadow material
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = - Math.PI / 2; // Rotate the plane to be horizontal
    plane.position.y = -1; // Position it slightly below the models
    plane.receiveShadow = true; // Enable receiving shadows
    scene.add(plane);

    let mesh1 = null;
    const loader = new GLTFLoader();

    // Load the first model (latte.glb)
    loader.load('./docs/latte.glb', (gltf) => {
      gltf.scene.traverse( function( model ) {
        if (model.isMesh){ 
         model.castShadow = true; 
        }
      });
      mesh1 = gltf.scene;
      mesh1.scale.set(1, 1, 1);
      mesh1.receiveShadow = true; // Enable receiving shadows (optional, depending on the model)
      mesh1.rotation.x = -0.1;
      mesh1.rotation.z = -0.2;
      scene.add(mesh1);
      mesh1.position.set(0, 0, 0); // Position for the first model
    });

    let mesh2 = null;
    // Load the second model (another_model.glb)
    loader.load('./docs/americano.glb', (gltf) => {
      mesh2 = gltf.scene;
      mesh2.scale.set(0.1, 0.1, 0.1);
      scene.add(mesh2);
      mesh2.position.set(0, 0, 3); // Position for the second model (offset from the first)
    });

    const animate = () => {
      requestAnimationFrame(animate);
      if (mesh1 && mesh1.rotation) {
        mesh1.rotation.y -= 0.005;
      }
      if (mesh2 && mesh2.rotation) {
        mesh2.rotation.y += 0.005; // Rotate the second model in the opposite direction for variety
      }
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on component unmount
    return () => {
      renderer.dispose();
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default ThreeDScene;
