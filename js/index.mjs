import Painter from "./Painter.mjs";
import PathSearcher from "./PathManager.mjs";

// Zapisujemy wymagane elementy HTML do zmiennych
const form = document.querySelector(".send-data-form");
const populationInput = document.querySelector("#population-size");
const iterationsInput = document.querySelector("#iterations");
const mutationInput = document.querySelector("#mutation-rate");
const tournamentParticipants = document.querySelector("#tournament-participants");
const elitismInput = document.querySelector("#elitism");

const distanceDisplay = document.querySelector("#distance");
const generationsCounter = document.querySelector("#generations-counter");
const drawEveryGenerationOption = document.querySelector("#draw-every-generation");
const drawLastGenerationOption = document.querySelector("#draw-last-generation");
const graphBox = document.querySelector(".graph-box");

// Tworzymy zarządcę algorytmu i malarza
const manager = new PathSearcher();
manager.addPaths();
const painter = new Painter();

// Uruchamiamy algorytm, tworzymy kolejne pokolenia
const runAlgorithm = event => {
    // Zapobiegamy odświeżeniu strony
    event.preventDefault();

    const drawEveryOption = drawEveryGenerationOption.checked && !drawLastGenerationOption.checked;

    manager.setParams(populationInput.value, iterationsInput.value, mutationInput.value, elitismInput.checked, tournamentParticipants.value);
    manager.startAlgorithm(drawEveryOption, distanceDisplay, generationsCounter, painter, graphBox);

    painter.drawRoute(manager.bestPath);
}

// Nasłuchujemy na zdarzenie wysłania formularza
form.addEventListener("submit", runAlgorithm);

document.addEventListener("DOMContentLoaded", () => {
    painter.drawCities(manager.bestPath.citiesOrder);
});
