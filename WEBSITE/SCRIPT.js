// script.js

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const nav = $("#nav");
const burger = $("#burger");
const links = $("#links");
const progress = $("#scrollbar");

function updateScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const value = max > 0 ? window.scrollY / max : 0;

  if (progress) {
    progress.style.transform = `scaleX(${value})`;
  }

  if (nav) {
    nav.classList.toggle("solid", window.scrollY > 24);
  }

  const timeline = $("#timeline");

  if (timeline) {
    const rect = timeline.getBoundingClientRect();
    const amount = Math.min(
      1,
      Math.max(
        0,
        (window.innerHeight * 0.75 - rect.top) /
          (rect.height + window.innerHeight * 0.25)
      )
    );

    timeline.style.setProperty("--p", amount);
  }
}

window.addEventListener("scroll", updateScroll, { passive: true });
window.addEventListener("resize", updateScroll);
updateScroll();

// Mobile navigation
if (burger && links) {
  burger.addEventListener("click", () => {
    const expanded = burger.getAttribute("aria-expanded") === "true";

    burger.setAttribute("aria-expanded", String(!expanded));
    links.classList.toggle("open", !expanded);
  });

  $$("a", links).forEach(link => {
    link.addEventListener("click", () => {
      burger.setAttribute("aria-expanded", "false");
      links.classList.remove("open");
    });
  });
}

// Reveal elements as they enter the viewport
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  $$(".reveal").forEach(element => revealObserver.observe(element));
} else {
  $$(".reveal").forEach(element => element.classList.add("in"));
}

// Automatically update the copyright year
const year = $("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

// Back-to-top button
const toTop = $("#toTop");

if (toTop) {
  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Project placeholder messages
$$("[data-placeholder]").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();

    const toast = $("#toast");

    if (toast) {
      toast.textContent = "This project link can be added when your project is published.";
      toast.classList.add("show");

      window.setTimeout(() => {
        toast.classList.remove("show");
      }, 2600);
    }
  });
});

// Animated particles in the hero background
const canvas = $("#bg");
const ctx = canvas ? canvas.getContext("2d") : null;

if (canvas && ctx) {
  let width = 0;
  let height = 0;
  let particles = [];

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    width = canvas.width = Math.floor(rect.width * ratio);
    height = canvas.height = Math.floor(rect.height * ratio);

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    particles = Array.from(
      { length: Math.min(75, Math.floor(rect.width / 18)) },
      () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        r: Math.random() * 1.8 + 0.5,
        speed: Math.random() * 0.25 + 0.08,
        alpha: Math.random() * 0.5 + 0.15
      })
    );
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(
        particle.x,
        particle.y,
        particle.r,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = `rgba(147,197,253,${particle.alpha})`;
      ctx.fill();

      if (!reduceMotion) {
        particle.y -= particle.speed;

        if (particle.y < -4) {
          particle.y = canvas.clientHeight + 4;
          particle.x = Math.random() * canvas.clientWidth;
        }
      }
    });

    if (!reduceMotion) {
      requestAnimationFrame(draw);
    }
  }

  resizeCanvas();
  draw();

  window.addEventListener("resize", resizeCanvas);
}