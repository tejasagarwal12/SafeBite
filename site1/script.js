const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const scannerCard = document.querySelector(".scanner-card");
const demoStatus = document.querySelector("#demoStatus");
const demoResult = document.querySelector("#demoResult");
const runDemo = document.querySelector("#runDemo");
const sampleSelect = document.querySelector("#sample");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".btn, .nav-cta").forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.remove("click-pop");
    void button.offsetWidth;
    button.classList.add("click-pop");
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const demoOutcomes = {
  Milk: ["safe", "Demo Result: SAFE"],
  Oil: ["unsafe", "Demo Result: POSSIBLE ADULTERATION"],
  Spices: ["safe", "Demo Result: SAFE"],
  Other: ["unsafe", "Demo Result: POSSIBLE ADULTERATION"]
};

runDemo.addEventListener("click", () => {
  const sample = sampleSelect.value;

  scannerCard.classList.remove("result-safe", "result-unsafe");
  scannerCard.classList.add("scanning");
  demoStatus.textContent = `Scanning ${sample} sample...`;
  demoResult.textContent = "Running simulated LED safety check.";
  runDemo.disabled = true;

  window.setTimeout(() => {
    const [type, label] = demoOutcomes[sample];
    scannerCard.classList.remove("scanning");
    scannerCard.classList.add(type === "safe" ? "result-safe" : "result-unsafe");
    demoStatus.textContent = label;
    demoResult.textContent = type === "safe"
      ? "Green indicator shown in this demonstration."
      : "Red indicator shown in this demonstration.";
    runDemo.disabled = false;
  }, 1600);
});
