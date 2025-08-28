async function getTime () {
    const response = await fetch('http://worldtimeapi.org/api/ip');
    const timeData = await response.json();

    return timeData;
}

async function getWeather () {
    const response = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=43&lon=-88&appid=ba922a1a69384fd5e5f6f751272f7f5a&units=imperial');
    const weatherData = await response.json();

    return weatherData;
}

async function getBackground () {
    const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=1cp6B0zU7htDEhqbRykb8M2me9HXHQvSi1LT31hB');
    const backgroundData = await response.json();

    return backgroundData;
}

async function main () {
    const weatherData = await getWeather();
    const timeData = await getTime();
    const backgroundData = await getBackground();
    console.log(timeData);

    const icon = weatherData.weather[0].icon;

    let dayOfWeek = timeData.day_of_week;
    switch (dayOfWeek) {
        case 0:
            dayOfWeek = 'Sunday';
            break;
        case 1:
            dayOfWeek = 'Monday';
            break;
        case 2:
            dayOfWeek = 'Tuesday';
            break;
        case 3:
            dayOfWeek = 'Wednesday';
            break;
        case 4:
            dayOfWeek = 'Thursday';
            break;
        case 5:
            dayOfWeek = 'Friday';
            break;
        case 6:
            dayOfWeek = 'Saturday';
            break;
    }

    let date = timeData.datetime;
    const year = date.slice(0,4);
    const month = date.slice(5,7);
    const day = date.slice(8,10);

    let time = date.slice(11,16);
    time += ' AM';
    let hour = Number(time.slice(0,2));
    if (hour > 12) {
        hour -= 12;
        time = time.replace('AM', 'PM');
        time = hour + time.slice(2);
    }

    document.querySelector('body').style.backgroundImage = `url(${backgroundData.url})`;
    document.querySelector('#imgText').textContent = `${backgroundData.explanation}`;
    document.querySelector('#info').onclick = () => {document.querySelector('#imgInfo').style.display = 'flex';};
    document.querySelector('#exit').onclick = () => {document.querySelector('#imgInfo').style.display = 'none';};
    document.querySelector('#dayName').textContent = `${dayOfWeek}`;
    document.querySelector('#date').textContent = `${month}/${day}/${year}`;
    document.querySelector('#temperature').textContent = `${Math.round(weatherData.main.temp)}°F`;
    document.querySelector('#feelsLike').textContent = `Feels like ${Math.round(weatherData.main.feels_like)}°F`;
    document.querySelector('#img').innerHTML = `<img src='https://openweathermap.org/img/wn/${icon}@2x.png'/>`;
    document.querySelector('#description').textContent = `${weatherData.weather[0].description}`;
    document.querySelector('#time').textContent = `${time}`;
}

main();