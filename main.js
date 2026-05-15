// Add cities here — each needs a matching background image in the project folder.
const cities = [
  { name: 'San Francisco', background: 'background-sf.png' },
  { name: 'New York', background: 'background-ny.png' },
];

const FADE_MS = 900;
const DISPLAY_MS = 4500;

const cityEl = document.getElementById('city-name');
const aboutCityEl = document.getElementById('about-city');
const bgLayers = [...document.querySelectorAll('.page-bg__layer')];
let cityIndex = 0;
let activeBgLayer = 0;
let rotating = false;

cities.forEach((city) => {
  const img = new Image();
  img.src = city.background;
});

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function setBackground(url) {
  const nextLayer = bgLayers[1 - activeBgLayer];
  const currentLayer = bgLayers[activeBgLayer];

  nextLayer.style.backgroundImage = `url('${url}')`;
  nextLayer.classList.add('is-active');
  currentLayer.classList.remove('is-active');
  activeBgLayer = 1 - activeBgLayer;
}

async function rotateCity() {
  if (rotating || cities.length < 2) return;
  rotating = true;

  cityEl.classList.add('is-fading');
  await wait(FADE_MS);

  cityIndex = (cityIndex + 1) % cities.length;
  const city = cities[cityIndex];
  cityEl.textContent = city.name;
  if (aboutCityEl) aboutCityEl.textContent = city.name;
  setBackground(city.background);

  cityEl.classList.remove('is-fading');
  await wait(FADE_MS);

  rotating = false;
}

function startRotation() {
  if (cities.length < 2) return;
  setInterval(rotateCity, DISPLAY_MS);
}

cityEl.textContent = cities[0].name;
if (aboutCityEl) aboutCityEl.textContent = cities[0].name;
bgLayers[0].style.backgroundImage = `url('${cities[0].background}')`;
bgLayers[0].classList.add('is-active');
startRotation();

// Polaroid stack — reveal left to right when about section scrolls into view
const aboutSection = document.getElementById('about');
const polaroids = [...document.querySelectorAll('.polaroid')];

if (aboutSection && polaroids.length) {
  let animated = false;

  const revealPolaroids = () => {
    if (animated) return;
    animated = true;
    polaroids.forEach((polaroid, i) => {
      setTimeout(() => polaroid.classList.add('is-visible'), i * 1000);
    });
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        revealPolaroids();
        observer.disconnect();
      }
    },
    { threshold: 0.25 }
  );

  observer.observe(aboutSection);
}
