import { Path } from "./Path.mjs";
import { City } from "./City.mjs";
import { DATA } from "./DATA.mjs";

export default class PathSearcher {
    citiesArray = [];
    population = [];
    populationCount = 1000;
    iterations = 500;
    mutationChance = 0.02;
    elitism = true;
    tournamentParticipantsCount = 5;

    constructor() {
        this.loadData(DATA);
    }

    // Dodawanie miast do tablicy wstępnej
    addCity(x, y) {
        this.citiesArray.push(new City(x, y));
    }

    // Wczytywanie danych z pliku i inicjacja wstępnej tablicy miast
    loadData(DATA) {
        DATA.forEach(el => {
            const [x, y] = el;
            this.addCity(x, y);
        });
    }

    // Tworzymy populację początkową
    addPaths() {
        this.population = [];
        while (this.population.length < this.populationCount) {
            const newPath = new Path([...this.citiesArray]);
            newPath.shuffleOrder();
            this.population.push(newPath);
        }

        this.findBestPath();
    }

    // Znajdujemy najlepszą trasę
    findBestPath() {
        const sortedList = [...this.population];
        this.sortPaths(sortedList);
        this.bestPath = sortedList[0];
    }

    // Sortowanie tras pod względem dystansu
    sortPaths(arr) {
        arr.sort((a, b) => a.distance - b.distance);
    }

    // Losowanie punktów przecięcia do operatora krzyżowania PMX
    generateThresholds() {
        let thresholds = {};
        let firstPoint = Math.floor(Math.random() * 47) + 1;
        let secondPoint = Math.floor(Math.random() * 47) + 1;

        if (firstPoint > secondPoint) {
            const tmp = firstPoint;
            firstPoint = secondPoint;
            secondPoint = tmp;
        }

        thresholds.firstPoint = firstPoint;
        thresholds.secondPoint = secondPoint;
        
        // Ponawiamy losowanie w przypadku wylosowania dwóch takich samych punktów
        while (thresholds.firstPoint === thresholds.secondPoint)
            thresholds = this.generateThresholds();

        return thresholds;
    }

    // Selekcja rodzica metodą turniejową
    tournamentSelection() {
        // Wstępna selekcja
        const tournamentParticipants = [];
        for (let i = 0; i < this.tournamentParticipantsCount; i++) {
            const randomIndex = Math.floor(Math.random() * this.populationCount);
            tournamentParticipants.push(this.population[randomIndex]);
        }
    
        // Znajdujemy najlepszego uczestnika turnieju
        let bestParticipant = tournamentParticipants[0];
        for (let participant of tournamentParticipants) {
            if (participant.fitness > bestParticipant.fitness) {
                bestParticipant = participant;
            }
        }
    
        return bestParticipant;
    }

    // Operator PMX krzyżowania
    crossoverPMX() {
        // Losowanie rodziców
        let parent1 = this.tournamentSelection();
        let parent2 = this.tournamentSelection();
        while (parent1 === parent2) {
            parent1 = this.tournamentSelection()
        }
        
        // Losowanie punktów przecięcia
        const points = this.generateThresholds();

        // Wstępna inicjacja potomków
        const newChild1 = new Array(48).fill(null);
        const newChild2 = new Array(48).fill(null);

        // Tablice odziedziczonych elementów trasy
        const child1InheritedCities = parent2.citiesOrder.slice(points.firstPoint, points.secondPoint);
        const child2InheritedCities = parent1.citiesOrder.slice(points.firstPoint, points.secondPoint);

        // Wstawiamy odziedziczone elementy od pierwszego rodzica
        newChild1.splice(points.firstPoint, points.secondPoint - points.firstPoint, ...child1InheritedCities);
        newChild2.splice(points.firstPoint, points.secondPoint - points.firstPoint, ...child2InheritedCities);

        // Dziedziczenie elementów trasy od drugiego rodzica
        let x = 0;
        for (let city of parent1.citiesOrder) {
            // Sprawdzamy, czy miejsce w tablicy jest wolne
            while (newChild1[x])
                x++;

            // Sprawdzamy, czy na trasie potomka jest już dane miasto
            if (newChild1.includes(city))
                continue;
            newChild1[x] = city;
            x++;
        }

        x = 0;
        for (let city of parent2.citiesOrder) {
            while (newChild2[x])
                x++;
            if (newChild2.includes(city))
                continue;
            newChild2[x] = city;
            x++;
        }

        return [new Path([...newChild1], this.num++), new Path([...newChild2], this.num++)];
    }

    // Generowanie kolejnych pokoleń
    createNewGeneration() {
        const newGeneration = [];
        while (newGeneration.length < this.populationCount) {
            const newChildren = this.crossoverPMX();
            newChildren[0].mutate(this.mutationChance);
            newChildren[1].mutate(this.mutationChance);
            newGeneration.push(newChildren[0]);
            if (newGeneration.length === this.populationCount)
                break;
            newGeneration.push(newChildren[1]);
        }

        // Zachowanie najlepszego osobnika z poprzedniego pokolenia przy włączonym elitaryzmie
        if (this.elitism === true) {
            this.sortPaths(newGeneration);
            this.population = [this.bestPath, ...newGeneration];
            this.population.pop();
        }
        else
            this.population = newGeneration;
        this.findBestPath();
    }

    // Uruchomienie algorytmu
    startAlgorithm(drawEveryOption, distanceDisplay, generationsCounter, painter, graphBox) {
        let i = 0;
        this.addPaths();
        graphBox.classList.remove("finished");
        graphBox.classList.add("in-progress");

        if (drawEveryOption) {
            // Funkcja wewnątrz wywołuje się co 100 milisekund, do czasu usunięcia interwału
            const interval = setInterval(() => {
                if (i < this.iterations) {
                    this.createNewGeneration();
                    painter.drawRoute(this.bestPath);
                    distanceDisplay.innerText = String(this.bestPath.distance);
                    i++;
                    generationsCounter.innerText = String(i);
                } else {
                    painter.drawRoute(this.bestPath);
                    clearInterval(interval);
                    
                    graphBox.classList.add("finished");
                    graphBox.classList.remove("in-progress");
                }
            }, 100);
        } else {
            for (i; i < this.iterations; i++)
                this.createNewGeneration();
            
            graphBox.classList.add("finished");
            graphBox.classList.remove("in-progress");
        }

        painter.drawRoute(this.bestPath);
        distanceDisplay.innerText = String(this.bestPath.distance);
        generationsCounter.innerText = String(i); 
    }

    // Wersja do testowania w środowisku Node.js
    startAlgorithmNode() {
        this.addPaths();
        
        for (let i = 0; i < this.iterations; i++) {
            this.createNewGeneration();
            console.log(this.bestPath.distance);
        }
    }

    // Zmiana parametrów algorytmu
    setParams(populationCount, iterations, mutationChance, elitism, tournamentParticipantsCount) {
        this.populationCount = populationCount;
        this.iterations = iterations;
        this.mutationChance = mutationChance;
        this.elitism = elitism;
        this.tournamentParticipantsCount = tournamentParticipantsCount;
    }
}
