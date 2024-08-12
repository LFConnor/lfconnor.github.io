import "/style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import Stats from "three/examples/jsm/libs/stats.module";

// Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.001,
  10000
);

// Light
const light = new THREE.AmbientLight(0xffffff);
light.position.set(2, 2, 2);
scene.add(light);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x1e3d59); // Sets background color to a space grey
camera.position.setZ(50);
renderer.render(scene, camera);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Load the OBJ file and apply orange material
const objLoader = new OBJLoader();
objLoader.load(
  "objWholeThing.obj", // Adjust path if necessary
  function (object) {
    const orangeMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6e40, // Orange color
      //wireframe: true,
    });

    // Apply material to all meshes
    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material = orangeMaterial;
      }
    });

    // Compute bounding box
    const box = new THREE.Box3().setFromObject(object);

    // Compute center of the bounding box
    const center = box.getCenter(new THREE.Vector3());

    // Reposition the object so its center is at the origin
    object.position.sub(center);

    scene.add(object);
  },
  (xhr) => {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  (error) => {
    console.log(error);
  }
);

const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(gridHelper);

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  render();

  stats.update();
}

function render() {
  renderer.render(scene, camera);
}

animate();
