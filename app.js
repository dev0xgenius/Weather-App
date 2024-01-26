const weatherApis = [
    "https://api.openweathermap.org/data/2.5/weather?",
    "https://api.openweathermap.org/data/2.5/forecast?"];

let requestInfo = {};
requestInfo["units"] = "metric";
requestInfo["appid"] = "689b503dd4e77f622825b85f5edb73af";

let weatherData = [];
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        position = position.coords;
        requestInfo['lat'] = position.latitude;
        requestInfo['lon'] = position.longitude;
        
        for (let count = 0; count < weatherApis.length; count++) {
            fullLink = addParameters(weatherApis[count], requestInfo);
            getWeatherInfo(fullLink)
                .then(updateUI);
        }
    });
}

let searchBar = document.getElementById("searchBar");
searchBar.addEventListener("search", event => {
    let requestLink = "";    
    for (let count = 0; count < weatherApis.length; count++) {
        requestLink = addParameters(weatherApis[count],
        {
            q: event.target.value,
            units: "metric",
            appid: "689b503dd4e77f622825b85f5edb73af",
        });
        getWeatherInfo(requestLink)
            .then(updateUI);
    }
});

async function getWeatherInfo(requestLink) {
    try {
        const response = await fetch(requestLink);
        return await response.json();
    } catch(err) {
        console.log(`   `);
    }
}

function updateUI(data) {
    if (!Object.keys(data).includes("list")) {
        updateWeather(data);
        updateDescription(data);

        return;
    }
}

function updateWeather(data){
    let weatherMain = document.querySelector(".main");
    let temp = data['main']['temp'].toFixed(0);
    let assumedTemp = data['main']['feels_like'].toFixed(0);

    let country = data['sys']['country'];
    country = typeof country == 'undefined' ? "" : (","+country);

    let sun = [
        timeOfDay(new Date(data['sys']['sunrise'] * 1000)),
        timeOfDay(new Date(data['sys']['sunset'] * 1000))
    ];
    
    weatherMain.querySelector(".weather-info").innerHTML = `
    <span data-deg>${temp}°</span><span>Feels Like ${assumedTemp}°</span>`;
    
    weatherMain.querySelector(".city-data").innerHTML = `
    <span class="city">${data['name']}${country}</span>
    <div class="sun-timing">
        <span><img src='./img/sunrise.png' width="64px" height="auto"/>
        ${sun[0]}</span>
        <span><img src='./img/sunset.png' width='64px' height='auto' />
        ${sun[1]}</span>
    </div>
    `;
}

function updateDescription(data) {
    let descriptionObj = document.querySelector(".description");
    let description = data['weather'][0]['description'];
    let iconNo = data['weather'][0]['icon'];

    descriptionObj.innerHTML = `
    <span>
        <span>${data['weather'][0]['main']}<br />
        <small>${description}</small></span>
        <img src="${imgSrc}" width="64px" height="auto" />
        ${data['main']['humidity']}%rh</span>
        <span><img src="./img/wind.svg" width="20px" height="auto" />
        ${data['wind']['speed']}km/h</span>
    </div>
    `
};

function addParameters(link, parameters) {
    let count = 0;
    for(let parameter of Object.keys(parameters)) { 
        parameter = `${parameter}=${parameters[parameter]}`;
        link += (count > 0) ? `&${parameter}` : parameter;
        
        count += 1;
    }
    return link;
}

function timeOfDay(dateObj){
    let time = dateObj.toTimeString();
    let hour = time.slice(0, 2);
 
    time = time.slice(0, 5);
    time += ((hour >= 12) ? "PM" : "AM");
    
    return time;
}