/**
 * Aquí estará la lógica principal de la aplicación.
 * Este bloque de código contiene la funcionalidad principal
 * que define el comportamiento del programa.
 */
import "../styles/input.css";
import { stays } from "./stays.js";

// General
const container = document.querySelector("#stays-container");
const locationInput = document.querySelector("#location");
const guestsInput = document.querySelector("#guests");
const searchBtn = document.querySelector("#searchButton");
const counter = document.querySelector("#counter");

// Modal
const suggestions = document.querySelector("#suggestions");
const searchModal = document.querySelector("#searchModal");
const closeModal = document.querySelector("#closeModal");
const modalOverlay = document.querySelector("#modalOverlay");
const modalLocation = document.querySelector("#modalLocation");
const modalSearch = document.querySelector("#modalSearch");
const adultsCount = document.querySelector("#adultsCount");
const childrenCount = document.querySelector("#childrenCount");
const guestsSummary = document.querySelector("#guestsSummary");

let adults = 0;
let children = 0;

// RENDER — Genera y muestra las cards
function renderStays(data) {
  const html = data
    .map((stay) => {
      const bedsText = stay.beds ? ` . ${stay.beds} beds` : "";
      const superHostBadge = stay.superHost
        ? `<p class="border rounded-xl px-2 py-0.5 font-semibold text-xs mr-2 text-gray-600">SUPERHOST</p>`
        : "";
      return `
    <article class="space-y-2">
      <div class="overflow-hidden rounded-3xl">
        <img class="w-full h-48 object-cover" src="${stay.photo}" alt="${stay.title}">
      </div>
      <div class="flex justify-between px-2">
        <div class="flex items-center text-sm text-gray-500">
          ${superHostBadge}
          <p>${stay.type}${bedsText}</p>
        </div>
        <div class="flex items-center">
          <img class="w-4 h-4" src="./src/images/icons/icons8-estrella-50.png" alt="rating">
          <p class="pl-2 text-sm">${stay.rating}</p>
        </div>
      </div>
      <h2 class="font-medium px-2">${stay.title}</h2>
    </article>
  `;
    })
    .join("");
  container.innerHTML = html;

  // Actualiza el contador de resultados
  const count = data.length;
  const displayCount = count > 12 ? "12+" : count;
  const label = count === 1 ? "stay" : "stays";
  counter.textContent = `${displayCount} ${label}`;
}
renderStays(stays);

// BÚSQUEDA — Filtra por ciudad y guests
searchBtn.addEventListener("click", () => {
  const city = locationInput.value.trim().toLowerCase();
  const guests = Number(guestsInput.value);

  const filteredStays = stays.filter((stay) => {
    return (
      (city === "" || stay.city.toLowerCase().includes(city)) &&
      stay.maxGuests >= guests
    );
  });
  renderStays(filteredStays);
});

// SUGERENCIAS
modalLocation.addEventListener("input", () => {
  const city = modalLocation.value;
  if (city === "") {
    suggestions.hidden = true;
    return;
  }
  const cities = [...new Set(stays.map((stay) => stay.city))];
  const matches = cities.filter((c) =>
    c.toLowerCase().includes(city.toLowerCase()),
  );
  const html = matches
    .map(
      (c) =>
        `<p class="px-4 py-2 hover:bg-gray-100 cursor-pointer suggestion-item">${c}, Finland</p>`,
    )
    .join("");
  suggestions.innerHTML = html;
  suggestions.hidden = false;
});

// Selecciona una sugerencia al clickear
suggestions.addEventListener("click", (e) => {
  if (!e.target.classList.contains("suggestion-item")) return;
  const city = e.target.textContent.split(",")[0];
  modalLocation.value = city;
  suggestions.hidden = true;
});

//Modal - Abre el modal al clickear la barra de búsqueda
document.querySelector(".relative").addEventListener("click", (e) => {
  if (e.target.closest("button")) return;
  searchModal.classList.remove("hidden");
  modalLocation.value = locationInput.value;
});

// Cierra el modal con la X
closeModal.addEventListener("click", (e) => {
  e.stopPropagation();
  searchModal.classList.add("hidden");
});

// Cierra el modal al clickear el overlay oscuro
modalOverlay.addEventListener("click", () => {
  searchModal.classList.add("hidden");
});

// CONTADORES — Adults y Children
document.querySelector("#adultsPlus").addEventListener("click", (e) => {
  e.stopPropagation();
  adults++;
  adultsCount.textContent = adults;
  updateGuestsSummary();
});

document.querySelector("#adultsMin").addEventListener("click", (e) => {
  e.stopPropagation();
  if (adults > 0) adults--;
  adultsCount.textContent = adults;
  updateGuestsSummary();
});

document.querySelector("#childrenPlus").addEventListener("click", (e) => {
  e.stopPropagation();
  children++;
  childrenCount.textContent = children;
  updateGuestsSummary();
});

document.querySelector("#childrenMin").addEventListener("click", (e) => {
  e.stopPropagation();
  if (children > 0) children--;
  childrenCount.textContent = children;
  updateGuestsSummary();
});

// Actualiza el resumen de guests en el modal
function updateGuestsSummary() {
  const total = adults + children;
  guestsSummary.textContent = total > 0 ? `${total} guests` : "Add guests";
  guestsInput.value = total > 0 ? total : "";
}

// RESET — Limpia todos los campos después de buscar
function resetSearch() {
  locationInput.value = "";
  guestsInput.value = "";
  modalLocation.value = "";
  adults = 0;
  children = 0;
  adultsCount.textContent = 0;
  childrenCount.textContent = 0;
  guestsSummary.textContent = "Add guests";
}

// BUSCAR DESDE EL MODAL — Aplica filtros y cierra
modalSearch.addEventListener("click", (e) => {
  e.stopPropagation();
  locationInput.value = modalLocation.value;
  searchModal.classList.add("hidden");
  searchBtn.click();
  resetSearch();
});
