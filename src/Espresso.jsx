import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './ThreeDScene.css'; // Include the CSS file for styling

const ThreeDScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    // Scene, camera, and renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 1, 1000);
    camera.position.set(9, 8, 1);
    camera.lookAt(1, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // Scene background
    scene.background = new THREE.Color('white');

    // // Axes Helper
    // const axesHelper = new THREE.AxesHelper(10);
    // scene.add(axesHelper);

    // Light
    const ambient = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambient);

    const light = new THREE.DirectionalLight(0xffffff, 2.5);
    light.castShadow = true;
    light.shadow.intensity = 1;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;   
    light.position.set(0, 2, 0).normalize();
    scene.add(light);

    const ambiance = new THREE.DirectionalLight(0xffffff, 1.5);
    ambiance.castShadow = true;
    ambiance.shadow.mapSize.width = 1024;
    ambiance.shadow.mapSize.height = 1024;   
    ambiance.position.set(1, -1.2, -3.5).normalize();
    scene.add(ambiance);



    // Ground Plane
    const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
    const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.4 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.3;
    plane.receiveShadow = true;
    scene.add(plane);

    let mesh1 = null;
    let mesh2 = null;
    let mesh3 = null;
    const loader = new GLTFLoader();

    // Load models
    loader.load('./docs/latte.glb', (gltf) => {
      gltf.scene.traverse((model) => {
        if (model.isMesh){
          model.castShadow = true;
          model.receiveShadow = true;
        }
      });
      mesh1 = gltf.scene;
      mesh1.scale.set(0.9, 0.9, 0.9);
      mesh1.position.set(3.3, 0, 0);
      mesh1.rotation.y = 1;
      mesh1.rotation.x = 0.3;
      mesh1.rotation.z = -0.35;
      scene.add(mesh1);
    });

    loader.load('./docs/mocha.glb', (gltf) => {
      gltf.scene.traverse((model) => {
        if (model.isMesh){
          model.castShadow = true;
          model.receiveShadow = true;
        }
      });
      mesh2 = gltf.scene;
      mesh2.scale.set(1.3, 1.3, 1.3);
      mesh2.position.set(0.9, -0.4, 0.6);
      mesh2.rotation.y = 1.9;
      mesh2.rotation.x = 0.2;
      mesh2.rotation.z = 0.01;

      scene.add(mesh2);
    });

    loader.load('./docs/cappucinno.glb', (gltf) => {
      gltf.scene.traverse((model) => {
        if (model.isMesh){
          model.castShadow = true;
          model.receiveShadow = true;
        }
      });
      mesh3 = gltf.scene;
      mesh3.scale.set(0.9, 1.5, 0.9);
      mesh3.position.set(0, 10, -2);
      mesh3.rotation.y = 3.5;
      mesh3.rotation.x = -0.12;
      mesh3.rotation.z = 0.01;
      scene.add(mesh3);
    });

    let deg = 0;

    const animate = () => {
      requestAnimationFrame(animate);

      // Bobbing effect for meshes
      const iheightCappucinno = 0.3;
      const iheightLatte = 0.09;
      const iheightMocha = 0.1;
      const amplitude = 0.09; // Height of the bobbing
      const frequency = 2; // Speed of the bobbing
      

  
      if (mesh1 && mesh2 && mesh3) {
        mesh1.position.y = Math.sin(deg * (180/Math.PI) * frequency ) * amplitude + iheightLatte;
        mesh2.position.y = Math.sin(deg * (180/Math.PI) * frequency + Math.PI/2) * amplitude + iheightMocha;
        mesh3.position.y = Math.sin(deg * (180/Math.PI) * frequency + Math.PI) * amplitude + iheightCappucinno;
          if (deg >= 360) {
            deg = 0;
          } else {
            deg += 0.0003;
          }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resizing
    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="threeDContainer" ref={mountRef} />;
};

export default ThreeDScene;
