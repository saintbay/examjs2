const api_key = 'fb76597e5626b19655c44ac0de34b19a'
const city = 'Astana';
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid${api_key}`

const cityInput = document.getElementById('city');
const searchBtn = document.getElementById('search');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab_content');
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        get_weather_today(city);
        get_fiveDay_forecast(city);
    } else {
        alert('Введите название города');
    }
});
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});
async function get_weather_today(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`;
        const response = await fetch(url);
        if (!response.ok) {
            alert('Город не найден');
            return;
        }
        const data = await response.json();
        display_today_weather(data);
    } catch (error) {
        alert('Произошла ошибка при получении данных о погоде.');
    }
}
async function get_fiveDay_forecast(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}&units=metric`;
        const response = await fetch(url);
        if (!response.ok) {
            alert('Прогнозные данные недоступны');
            return;
        }
        const data = await response.json();
        display_forecast(data);
    } catch (error) {
        alert('Произошла ошибка при получении прогноза.');
    }
}
function display_today_weather(data) {
    const summary = document.getElementById('summary');
    const details = document.getElementById('details');
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    summary.innerHTML = `
        <h2>${data.name}</h2>
        <p>Температура(цельсий): ${data.main.temp}°C</p>
        <p>Ощущается как: ${data.main.feels_like}°C</p>
        <p>${data.weather[0].description}</p>
    `;
    details.innerHTML = `
        <p>Влажность: ${data.main.humidity}%</p>
        <p>Скорость ветра: ${data.wind.speed} m/s</p>
        <p>Восход: ${sunrise}</p>
        <p>Закат: ${sunset}</p>
    `;
}
function display_forecast(data) {
    const forecastList = document.getElementById('forecast_list');
    forecastList.innerHTML = '';
    const days = data.list.filter((item, index) => index % 8 === 0);
    days.forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString();
        forecastList.innerHTML += `
            <div class="forecast-item">
                <p>${date}</p>
                <p>${day.weather[0].description}</p>
                <p>${day.main.temp}°C</p>
            </div>
        `;
    });
}

