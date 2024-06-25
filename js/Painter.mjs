export default class Painter {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    // Rysowanie miast na kanwie
    drawCities(cities) {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.ctx.fillStyle = 'red';
        for (let city of cities) {
            this.ctx.beginPath();
            this.ctx.arc(city.xCoordinate / 10 + 50, city.yCoordinate / 10 + 50, 5, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }

    // Funkcja rysująca trasę na kanwie
    drawRoute(path) {
        const ctx = window.ctx;
        const cities = path.citiesOrder;

        // Wyczyść kanwę przed rysowaniem
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.drawCities(cities);  // Narysuj ponownie miasta

        // Rysuj trasę
        this.ctx.strokeStyle = 'blue';
        this.ctx.fillStyle = 'red';
        this.ctx.beginPath();
        this.ctx.moveTo(cities[0].xCoordinate/10 + 50, cities[0].yCoordinate/10 + 50);
        for (let i = 1; i < cities.length; i++) {
            this.ctx.lineTo(cities[i].xCoordinate/10 + 50, cities[i].yCoordinate/10 + 50);
        }
        // Zakończ pętlę, łącząc ostatnie miasto z pierwszym
        this.ctx.lineTo(cities[0].xCoordinate/10 + 50, cities[0].yCoordinate/10 + 50);
        this.ctx.stroke();
    }
}
