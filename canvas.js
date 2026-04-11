import * as THREE from "/libs/three.module.js";
import { OrbitControls } from "/libs/OrbitControls.js";
import gsap from "/libs/gsap.js";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("cyber-canvas");
  if (!canvas) return;

  // Scene Setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0x00ff88, 20);
  pointLight.position.set(5, 5, 5);
  scene.add(pointLight);

  // Grid Configuration
  const GRID_SIZE = 40;
  const SPACING = 1.1;
  const totalInstances = GRID_SIZE * GRID_SIZE;

  // Geometry & Material
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({
    color: 0x222222,
    shininess: 100,
  });

  // Instanced Mesh
  const instancedMesh = new THREE.InstancedMesh(
    geometry,
    material,
    totalInstances,
  );
  scene.add(instancedMesh);

  // Helper to set instance positions in a grid
  const dummy = new THREE.Object3D();
  const positions = [];

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const x = (i - GRID_SIZE / 2) * SPACING;
      const z = (j - GRID_SIZE / 2) * SPACING;
      positions.push({ x, z });

      dummy.position.set(x, 0, z);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i * GRID_SIZE + j, dummy.matrix);
    }
  }

  camera.position.set(0, 30, 40);
  camera.lookAt(0, 0, 0);

  // Mouse Interaction
  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // Flat plane for raycasting
  const mouseWorldPos = new THREE.Vector3();

  window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    // Update mouse world position
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, mouseWorldPos);

    const time = Date.now() * 0.002;

    for (let i = 0; i < totalInstances; i++) {
      const pos = positions[i];

      // Calculate distance from mouse to this instance
      const dist = mouseWorldPos.distanceTo(new THREE.Vector3(pos.x, 0, pos.z));

      // Ripple Logic: Sine wave based on distance and time
      const ripple = Math.sin(dist * 0.5 - time) * 2;
      const intensity = Math.max(0, 10 - dist) * 0.2; // Fade out ripple based on distance

      const y = ripple * intensity;
      const scale = 1 + y * 0.2;

      dummy.position.set(pos.x, y, pos.z);
      dummy.scale.set(1, Math.max(0.1, scale), 1);

      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;

    renderer.render(scene, camera);
  }

  // Handle Resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
});
