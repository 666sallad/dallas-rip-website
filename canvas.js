document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("cyber-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };

  const screenArea = document.querySelector(".monitor-screen") || document.body;
  if (screenArea) {
    screenArea.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    screenArea.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Add interactive click/tap explosion effect
    screenArea.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Spawn extra interactive particles at click location
      for (let i = 0; i < 15; i++) {
        const size = Math.random() * 2 + 1;
        const velocityX = Math.random() * 6 - 3;
        const velocityY = Math.random() * 6 - 3;
        particles.push(
          new Particle(clickX, clickY, velocityX, velocityY, size),
        );
      }
    });
  }

  function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    particles = [];
    const numParticles = (width * height) / 9000;

    for (let i = 0; i < numParticles; i++) {
      const size = Math.random() * 1.5 + 0.5;
      const x = Math.random() * width;
      const y = Math.random() * height;
      const velocityX = Math.random() * 0.5 - 0.25;
      const velocityY = Math.random() * 0.5 - 0.25;

      particles.push(new Particle(x, y, velocityX, velocityY, size));
    }
  }

  class Particle {
    constructor(x, y, velocityX, velocityY, size) {
      this.x = x;
      this.y = y;
      this.velocityX = velocityX;
      this.velocityY = velocityY;
      this.size = size;
      this.baseSize = size;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

      // Dynamic coloring to make clicks pop
      const intensity = Math.min(255, Math.abs(this.velocityX * 80) + 180);
      ctx.fillStyle = `rgba(${intensity}, 255, 255, 0.6)`;
      ctx.fill();
    }

    update() {
      this.x += this.velocityX;
      this.y += this.velocityY;

      // Bounce off walls
      if (this.x > width || this.x < 0) this.velocityX = -this.velocityX;
      if (this.y > height || this.y < 0) this.velocityY = -this.velocityY;

      // Interaction with mouse pointer
      if (mouse.x !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          this.x -= (dx / distance) * force * 1.5;
          this.y -= (dy / distance) * force * 1.5;
          this.size = this.baseSize * 2.5;
        } else {
          this.size = this.baseSize;
        }
      }
      this.draw();
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(5, 5, 5, 0.1)";
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      for (let j = i; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 255, 200, ${0.15 - distance / 800})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  window.addEventListener("resize", init);
  init();
  animate();
});
