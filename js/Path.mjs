export class Path {
    constructor(cities) {
        this.citiesOrder = cities;
        this.calculateDistance();
        this.calculateFitness();
    }

    // Obliczanie dystansu trasy
    calculateDistance() {
        this.distance = this.citiesOrder.reduce((sum, curr, index, arr)=> {
            if (index === 0)
                return sum + Math.sqrt((curr.xCoordinate - arr[arr.length - 1].xCoordinate) ** 2 + (curr.yCoordinate - arr[arr.length - 1].yCoordinate) ** 2);
            else
                return sum + Math.sqrt((curr.xCoordinate - arr[index - 1].xCoordinate) ** 2 + (curr.yCoordinate - arr[index - 1].yCoordinate) ** 2);
        }, 0)
    }

    // Funkcja przystosowania
    calculateFitness() {
        this.fitness = 1 / this.distance;
    }

    // Mieszanie punktów trasy
    shuffleOrder() {
        // Pomijamy pierwszy element
        const citiesToShuffle = this.citiesOrder.slice(1);

        // Algorytm Fisher–Yates
        for (let i = citiesToShuffle.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [citiesToShuffle[i], citiesToShuffle[j]] = [citiesToShuffle[j], citiesToShuffle[i]];
        }
        
        this.citiesOrder = [this.citiesOrder[0], ...citiesToShuffle];
        }

        // Mutowanie osobnika
        mutate(mutationChance) {
            if (Math.random() <= mutationChance) {
                const firstCity = Math.floor(Math.random() * 47) + 1;
                const secondCity = Math.floor(Math.random() * 47) + 1;

                [this.citiesOrder[firstCity], this.citiesOrder[secondCity]] = [this.citiesOrder[secondCity], this.citiesOrder[firstCity]];
            }
        }
    }
