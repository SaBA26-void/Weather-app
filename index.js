fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=f02d3193a4a04f8191e161138252811&q=Tbilisi&days=1&aqi=no&alerts=no`
)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        console.log('forcast days:', data.forecast.forcastday);

        const forecastContainer = document.querySelector('.forecast-div');
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
            <h4>${day.day.maxtemp_c}℃<h4/>
            <h4>${day.day.mintemp_c}℃<h4/>
            <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
            `;
            forecastContainer.appendChild(div);
        });
        console.log(data);
    })
    .catch((error) => console.log(error));
