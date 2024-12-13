import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Global variable to keep track of the object to render
let objToRender = 'eye'; // Initial model to load
let previousModel = 'eye'; // Track the previous model

let object; // For the 3D object
let controls; // For the camera controls
const loader = new GLTFLoader(); // For loading .gltf models

// Instantiate a renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// Lights
const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 1);
scene.add(ambientLight);

// Load the model based on objToRender
function loadModel() {
  if (object) {
    scene.remove(object);
  }

  // Load the new model
  loader.load(
    `models/${objToRender}/scene.gltf`,
    function (gltf) {
      object = gltf.scene;
      scene.add(object);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    function (error) {
      console.error(error);
    }
  );

  // Update camera position and controls based on the model
  if (objToRender === "dino") {
    camera.position.z = 25;
    if (!controls) {
      controls = new OrbitControls(camera, renderer.domElement);
    }
  } else {
    camera.position.z = 500;
    if (controls) {
      controls.dispose();
      controls = null;
    }
  }
}

loadModel();

// Toggle the model when the button is clicked
document.getElementById("toggleModelButton").onclick = function () {
  // Log the transition to verify the flow
  console.log("Previous model:", previousModel);
  console.log("Current model:", objToRender);

  // Toggle between 'eye' and 'dino'
  const newModel = objToRender === "eye" ? "dino" : "eye"; 
  objToRender = newModel; 
  
  // Reset camera position when switching from 'dino' to 'eye'
  if (previousModel === "dino" && objToRender === "eye") {
    console.log("Resetting camera for 'eye' model");
    camera.position.set(0, 0, 500); // Reset camera for 'eye' model
  }

  loadModel();
  // Update the previous model for the next toggle
  previousModel = objToRender;
};

// Resize listener
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
};

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  if (object && objToRender === "eye") {
    // Adjust eye rotation based on mouse position
    object.rotation.y = -3 + mouseX / window.innerWidth * 3;
    object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
  }

  renderer.render(scene, camera);
}

animate();
