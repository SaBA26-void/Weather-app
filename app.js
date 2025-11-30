function getForcast() {
    if (document.querySelector('.day-card')) {
        document.querySelectorAll('.day-card').forEach(e => e.remove());
    }
    let city = document.getElementById('city').value || 'Telaviv';
    let days = document.getElementById('days').value || 7;

    if (days < 1) days = 1;
    if (days > 7) days = 7;


    fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=f02d3193a4a04f8191e161138252811&q=${city}&days=${days}&aqi=no&alerts=no`
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
                <div class="img-city-div">Temp ℃: ${data.current.condition.text}
                <img src="${data.current.condition.icon}" />
                <div/>
            `;
            cityDiv.appendChild(city);
            data.forecast.forecastday.forEach(day => {
                console.log('date:', day.date, '\n',
                    'condition:', day.day.condition.text, '\n',
                    'max temp:', day.day.maxtemp_c, '\n',
                    'min temp:', day.day.mintemp_c, '\n'
                );

                const dayCard = document.createElement('div');
                dayCard.classList.add('day-card');
                dayCard.innerHTML =
                    `
                    <h3>${day.date}<h3/>
                    <h3>${day.day.condition.text}<h3/>
                    <h4 class="temp">Max ${day.day.maxtemp_c}℃<h4/>
                    <h4 class="temp">Min ${day.day.mintemp_c}℃<h4/>
                    <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
            `;
                forecastContainer.appendChild(dayCard);
            });
            console.log(data);
        })
        .catch((error) => console.log(error));
}