import "../styles/reset.css";
import "../styles/style.css";
import * as weather from "./weatherInfo";
import * as DOM from "./DOM";

const oWApi = "98cccf764149f70e06a6a27d3efe0a34";

navigator.geolocation.getCurrentPosition(async (x) => {
	let userLoc = {};
	userLoc.lat = x.coords.latitude;
	userLoc.long = x.coords.longitude;

	let cityNameRequest = await fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${userLoc.lat}&lon=${userLoc.long}&limit=1&appid=${oWApi}`);

	let cityNameResponse = await cityNameRequest.json();
	setLocation(`${cityNameResponse[0].name}, ${cityNameResponse[0].state}`);
});

export async function setLocation(location) {
	let forecasts;
	forecasts = await weather.getForecasts(location);
	let fiveDay = forecasts[Object.keys(forecasts)[0]];
	let current = forecasts[Object.keys(forecasts)[1]];

	DOM.makeGifBackground(`${current.results.weather[0].main}`);
	DOM.makeFiveDayDisplay(fiveDay);
	DOM.makeCurrentDisplay(current);
}
