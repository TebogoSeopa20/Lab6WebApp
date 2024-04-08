document.addEventListener('DOMContentLoaded', () => {
    const loadCarsBtn = document.getElementById('loadCarsBtn');
    const carList = document.getElementById('carList');
    let cars = [];

    // Function to render cars on the page
    function renderCars() {
        carList.innerHTML = '';
        cars.forEach((car, index) => {
            const carCard = document.createElement('div');
            carCard.classList.add('car-card');
            carCard.innerHTML = `
                <h2>${car.make} ${car.model}</h2>
                <p><strong>Year:</strong> ${car.year}</p>
                <p><strong>Make:</strong> ${car.make}</p>
                <p><strong>Model:</strong> ${car.model}</p>
                <p><strong>Color:</strong> ${car.color}</p>
                <p><strong>Price:</strong> R${car.price}</p>
                <button class="btn btn-remove" data-index="${index}">Remove</button>
            `;
            carList.appendChild(carCard);
        });
    }

    // Load cars when "Load Cars" button is clicked
    loadCarsBtn.addEventListener('click', () => {
        fetch('http://localhost:3001/cars')
            .then(response => response.json())
            .then(data => {
                cars = data;
                renderCars();
            })
            .catch(error => {
                console.error('Error fetching car data:', error);
            });
    });

    // Function to add a new car
    function addCar(newCar) {
        fetch('http://localhost:3001/cars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newCar)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                // Reload cars after adding
                loadCarsBtn.click();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Form submission event listener
    const carForm = document.getElementById('carForm');
    carForm.addEventListener('submit', event => {
        event.preventDefault();
        const make = document.getElementById('make').value;
        const model = document.getElementById('model').value;
        const year = document.getElementById('year').value;
        const color = document.getElementById('color').value;
        const price = document.getElementById('price').value;
        addCar({ make, model, year, color, price });
        carForm.reset();
    });

    // Function to remove a car
    function removeCar(index) {
        const carId = cars[index].id;
        fetch(`http://localhost:3001/cars/${carId}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                // Reload cars after removal
                loadCarsBtn.click();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Event delegation for remove buttons
    carList.addEventListener('click', event => {
        if (event.target.classList.contains('btn-remove')) {
            const index = event.target.dataset.index;
            removeCar(index);
        }
    });
});
