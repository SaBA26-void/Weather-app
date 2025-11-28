function getForcast() {
    if (!document.querySelector('.forecast-div').innerHTML == '') {
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
            <h4>Max ${day.day.maxtemp_c}℃<h4/>
            <h4>Min ${day.day.mintemp_c}℃<h4/>
            <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
            `;
                    forecastContainer.appendChild(dayCard);
                });
                console.log(data);
            })
            .catch((error) => console.log(error));
    } else {
        document.querySelector('.forecast-div').innerHTML = '';
        getForcast();
    }
}