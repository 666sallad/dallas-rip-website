import * as THREE from "./node_modules/three/build/three.module.js";
import gsap from "./node_modules/gsap/index.js";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("cyber-canvas");
  if (!canvas) return;

  // Scene Setup
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Texture Loader
  const textureLoader = new THREE.TextureLoader();
  const cityscapeTexture = textureLoader.load(
    "assets/uploads/hong kong at night.jpg",
  );

  // Geometry
  const geometry = new THREE.PlaneGeometry(2, 2);

  // Shader Material
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uClickTime: { value: -999.0 },
      uClickPos: { value: new THREE.Vector2(0.5, 0.5) },
      uCityscape: { value: cityscapeTexture },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uMouse;
        uniform float uClickTime;
        uniform vec2 uClickPos;
        uniform sampler2D uCityscape;
        varying vec2 vUv;

        void main() {
            // Sharper Pixelation
            float pixelSize = 200.0;
            vec2 pix_uv = floor(vUv * pixelSize) / pixelSize;
            vec4 cityscapeColor = texture2D(uCityscape, pix_uv);

            // Desaturated blue monochrome palette
            float brightness = dot(cityscapeColor.rgb, vec3(0.299, 0.587, 0.114));
            vec3 color = vec3(brightness) * vec3(0.4, 0.6, 1.0); // More desaturated tint

            // Interaction
            float mouse_dist = distance(vUv, uMouse);
            float click_dist = distance(vUv, uClickPos);
            float time_since_click = uTime - uClickTime;

            // Subtle "breathing" effect for lights
            float life = sin(uTime * 0.5 + brightness * 10.0) * 0.1 + 0.9;

            if (brightness > 0.2) { // Lower threshold for more lights
                color *= life; // Apply breathing to base color

                // Softer mouse glow
                float glow = smoothstep(0.25, 0.0, mouse_dist);
                color += glow * 0.3;

                // Click/Tap flash
                if (time_since_click > 0.0 && time_since_click < 1.0) {
                    float flash = smoothstep(0.1, 0.0, click_dist) * (1.0 - time_since_click);
                    color += flash * 0.8;
                }
            }

            // Add a vignette for readability
            float vignette = 1.0 - smoothstep(0.8, 1.2, length(vUv - 0.5));
            color *= vignette;

            // Add a smooth fade to black at the bottom
            float fade_gradient = smoothstep(0.0, 0.15, vUv.y);
            color *= fade_gradient;

            gl_FragColor = vec4(color, 1.0);
        }
    `,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Event Listeners
  window.addEventListener("mousemove", (e) => {
    gsap.to(material.uniforms.uMouse.value, {
      x: e.clientX / window.innerWidth,
      y: 1.0 - e.clientY / window.innerHeight,
      duration: 0.5,
      ease: "power2.out",
    });
  });

  window.addEventListener("click", (e) => {
    material.uniforms.uClickTime.value = material.uniforms.uTime.value;
    material.uniforms.uClickPos.value.x = e.clientX / window.innerWidth;
    material.uniforms.uClickPos.value.y = 1.0 - e.clientY / window.innerHeight;
  });

  // Animation Loop
  const clock = new THREE.Clock();
  function animate() {
    const elapsedTime = clock.getElapsedTime();
    material.uniforms.uTime.value = elapsedTime;
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  // Handle Resize
  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    material.uniforms.uResolution.value.set(
      window.innerWidth,
      window.innerHeight,
    );
    camera.updateProjectionMatrix();
  });

  animate();
});
