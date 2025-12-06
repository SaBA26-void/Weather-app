function getForcast() {
    if (document.querySelector('.day-card')) {
        document.querySelectorAll('.day-card').forEach(e => e.remove());
    }
    let city = document.getElementById('city').value || 'Mestia';

    fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=f02d3193a4a04f8191e161138252811&q=${city}&days=14&aqi=no&alerts=no`
    )
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log('forcast days:', data.forecast.forecastday);
            const forecastContainer = document.querySelector('.forecast-div');
            const cityDiv = document.querySelector('.city-div');
            cityDiv.innerHTML = `<h4>Current Weather</h4>`;
            const city = document.createElement('div');
            city.classList.add('city-div-element');
            city.innerHTML = `
                <div>Last Updated: ${data.current.last_updated}<div/>
                <div>Location: ${data.location.name}<div/>
                <div>Local Date-Time: ${data.location.localtime}<div/>
                <div>Temp ℃: ${data.current.temp_c}<div/>
                <div>Feelslike Temp ℃: ${data.current.feelslike_c}<div/>
                <div class="img-city-div">Current Condition: ${data.current.condition.text}
                <img src="${data.current.condition.icon}" />
                <div/>
            `;
            cityDiv.appendChild(city);
            let i = 0;
            data.forecast.forecastday.forEach(day => {
                i++;
                console.log('date:', day.date, '\n',
                    'condition:', day.day.condition.text, '\n',
                    'max temp:', day.day.maxtemp_c, '\n',
                    'min temp:', day.day.mintemp_c, '\n'
                );
                const dayCard = document.createElement('div');
                dayCard.classList.add('day-card');
                dayCard.innerHTML =
                    `
                    <h2 style="color: #1e3a8a;">${getWeekDays(day)}<h2/>
                    <h4 style="color: #1e3a8a;">${day.date}<h4/>
                    <h4 class="temp">Max ${day.day.maxtemp_c}℃<h4/>
                    <h4 class="temp">Min ${day.day.mintemp_c}℃<h4/>
                    <h3>${day.day.condition.text}<h3/>
                    <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
                    `;
                if (i > 7) {
                    dayCard.style.backgroundColor = '#8a1e1eff';
                    dayCard.innerHTML += `<h4 style="color: #1e3a8a;">Week 2, may be inaccurate<h4/>`;
                }
                forecastContainer.appendChild(dayCard);
            });
        })
        .catch((error) => console.log(error));
}

function getWeekDays(day) {
    const weekDay = new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' });
    return weekDay;
}

// Fetch and display city suggestions
function fetchCitySuggestions(query) {
    fetch(`https://api.weatherapi.com/v1/search.json?key=f02d3193a4a04f8191e161138252811&q=${query}`)
        .then(response => response.json())
        .then(data => {
            const suggestions = document.getElementById('city-suggestions');
            suggestions.innerHTML = '';
            data.forEach(city => {
                const option = document.createElement('div');
                option.classList.add('suggestion-item');
                option.textContent = city.name;
                option.addEventListener('click', () => {
                    document.getElementById('city').value = city.name;
                    suggestions.innerHTML = '';
                    getForcast();
                });
                suggestions.appendChild(option);
            });
        })
        .catch(error => console.log('Error fetching city suggestions:', error));
}

// Get default weather forecast based on user's location
function getDefaultForecast() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetch(`https://api.weatherapi.com/v1/forecast.json?key=f02d3193a4a04f8191e161138252811&q=${latitude},${longitude}&days=14&aqi=no&alerts=no`)
                .then(response => response.json())
                .then(data => {
                    document.getElementById('city').value = data.location.name;
                    getForcast();
                })
                .catch(error => console.log('Error fetching default forecast:', error));
        }, error => {
            console.log('Geolocation error:', error);
            getForcast();
        });
    } else {
        console.log('Geolocation not supported by this browser.');
        getForcast();
    }
}

document.getElementById("city").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        getForcast();
    }
});

// Event listener for city input suggestions
document.getElementById('city').addEventListener('input', function () {
    const query = this.value;
    if (query.length > 2) {
        fetchCitySuggestions(query);
    } else {
        document.getElementById('city-suggestions').innerHTML = '';
    }
});

// Call default forecast on page load
window.addEventListener('load', getDefaultForecast);