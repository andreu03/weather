import conditions from "./conditions.js";
const apiKey = '88f5a436e1f24bebaac94035231503';

const header = document.querySelector('.header');
const form = document.querySelector('#form');
const input = document.querySelector('#inputCity');

function removeCard(){
    const prevCard = document.querySelector('.card');
    if (prevCard) prevCard.remove();
}

function showError(errorMessage){
    const html = `<div class='card'>${data.error.message}</div>`;
    header.insertAdjacentHTML('afterend', html);
}

function showCard({name, country, temp, condition, imgPath}) {
    const html = `<div class="card">
    <h2 class="card-city">${name} <span>${country}</span></h2>

    <div class="card-weather">
        <div class="card-value">${temp}<sup>°c</sup></div>
        <img class="card-img" src="${imgPath}" alt="Weather">
    </div>

        <div class="card-description">${condition}</div>
    </div>`;
    header.insertAdjacentHTML('afterend', html);
}

async function getWeather(city) {
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

let city;

form.onsubmit = async function(e) {
    e.preventDefault();
    city = input.value.trim();
    const data = await getWeather(city);
    // Запрос на сервер
    
    if (data.error) {
        removeCard();
        showError(data.error.message);

    } else {
        removeCard();

        // const response = await fetch('./conditions.json');
        const info = conditions.find(
            (obj) => obj.code === data.current.condition.code
            );
        
        const filePath = './img/' + (data.current.is_day ? 'day' : 'night') + '/';
        const fileName = (data.current.is_day ? info.day : info.night) + '.png';
        const imgPath = filePath + fileName; 

        const weatherData = {
            name: data.location.name,
            country: data.location.country,
            temp: data.current.temp_c,
            condition: data.current.is_day 
                ? info.languages[23]['day_text']
                : info.languages[23]['night_text'],
            imgPath,
        };

        showCard(weatherData);
    }
}