import { setLocation } from "./index";
import clear from "../assets/video/clearSkyOcean.mp4";
import thunderstorm from "../assets/video/lightningBlackBack.mp4";
import rain from "../assets/video/rainBlackBackground.mp4";
import snow from "../assets/video/snowBlackBack.mp4";
import fog from "../assets/video/fogblackbackground.mp4";
import cloudy from "../assets/video/clearDay.mp4";
import glass from "../assets/image/icons8-magnifying-glass.svg";
import { cnvrtFiveDayDate } from "./utils";

const body = document.getElementById("body");
const citySelector = document.getElementById("citySelector").children[0];
const unitSelector = document.getElementsByClassName("units");
const currentForecast = document.getElementById("currentForecast");
const fiveDayForecast = document.getElementById("fiveDayForecast");
const inputWrapper = document.getElementById("inputWrapper");
const video = document.createElement("video");
const timeDisplay = document.getElementById("currentTime");
video.setAttribute("autoplay", "");
video.setAttribute("loop", "");
video.setAttribute("id", "backgroundVideo");
body.append(video);
const magGlass = document.createElement("input");
magGlass.setAttribute("type", "image");
magGlass.setAttribute("src", glass);
magGlass.setAttribute("id", "magGlass");
inputWrapper.append(magGlass);

let sunrise = document.getElementById("sunRise").parentElement;
let sunset = document.getElementById("sunSet").parentElement;
let sunriseTime = document.createElement("span");
sunrise.append(sunriseTime);

let sunsetTime = document.createElement("span");
sunset.append(sunsetTime);

citySelector.addEventListener("submit", (x) => {
	document.querySelector(".loader-wrapper").style.visibility = "visible";
	let cityInput = x.target[0].value;
	setLocation(cityInput);
	x.preventDefault();
	x.target.reset();
});

export async function makeGifBackground(condition) {
	let bkgdVid;

	switch (condition) {
		case "Thunderstorm":
			bkgdVid = thunderstorm;
			break;
		case "Drizzle":
		case "Rain":
			bkgdVid = rain;
			break;
		case "Snow":
			bkgdVid = snow;
			break;
		case "Clear":
			bkgdVid = clear;
			break;
		case "Clouds":
			bkgdVid = cloudy;
			break;
		default:
			bkgdVid = fog;
			break;
	}

	video.setAttribute("src", bkgdVid);
}

export async function makeCurrentDisplay(forecastInfo) {
	let currentTime = new Date(forecastInfo.results.dt * 1000).toLocaleString();
	currentTime = currentTime.substring(0, currentTime.replace(":", "").search(":") + 1) + " " + currentTime.substring(currentTime.length - 2);
	currentTime = currentTime.replace(",", "");
	timeDisplay.innerText = currentTime;
	let location = currentForecast.children[0];
	let temp = currentForecast.children[1];
	let desc = currentForecast.children[2];
	let high = currentForecast.children[3];
	let low = currentForecast.children[4];
	let fhw = currentForecast.children[5];
	let weatherDesc = forecastInfo.results.weather[0].main == "Clouds" ? "Cloudy" : forecastInfo.results.weather[0].main;
	let icon = `https://openweathermap.org/img/wn/${forecastInfo.results.weather[0].icon}@2x.png`;
	console.log(forecastInfo);
	location.innerText = `${forecastInfo.results.name}, ${forecastInfo.loc.locState}, ${forecastInfo.loc.locCountry}`;

	temp.innerHTML = `${Math.floor(forecastInfo.results.main.temp)}${forecastInfo.units[0]}`;
	desc.innerHTML = `${weatherDesc}<img src='${icon}'>`;
	low.innerHTML = `Low : ${Math.floor(forecastInfo.results.main.temp_min)}${forecastInfo.units[0]}`;
	high.innerHTML = `High: ${Math.floor(forecastInfo.results.main.temp_max)}${forecastInfo.units[0]}`;
	fhw.innerHTML = `<span>Feels Like: ${Math.floor(forecastInfo.results.main.feels_like)}${forecastInfo.units[0]}</span><span>Humidity: ${Math.floor(
		forecastInfo.results.main.humidity
	)}%</span><span>Wind: ${forecastInfo.results.wind.speed}${forecastInfo.units[1]}</span><span></span>`;

	sunriseTime.innerText = `${new Date(forecastInfo.results.sys.sunrise).toLocaleTimeString()}`;

	sunsetTime.innerText = `${new Date(forecastInfo.results.sys.sunset).toLocaleTimeString()}`;
}

export async function makeFiveDayDisplay(forecastInfo) {
	let forecastCount = 1;
	fiveDayForecast.childNodes[3].innerHTML = "";
	forecastInfo.results.list.forEach((forecast) => {
		let dateObj = new Date(forecast.dt * 1000);
		let dayOfWeek = dateObj.toDateString().substring(0, 3);
		let date = dateObj.toLocaleString();
		let dateTime = cnvrtFiveDayDate(date);
		let temp = forecast.main.temp.toString().split(".")[0];
		let units = forecastInfo.units[0];
		let low = forecast.main.temp_min.toString().split(".")[0];
		let high = forecast.main.temp_max.toString().split(".")[0];
		let description = forecast.weather[0].main;
		description = description == "Clouds" ? "Cloudy" : description;
		let icon = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

		const displayDiv = document.createElement("section");
		displayDiv.classList.add("fiveDayDivs");
		displayDiv.setAttribute("id", `fiveDay${forecastCount}`);
		forecastCount++;

		displayDiv.innerHTML = `<span class='dayOfWeek'>${dayOfWeek}</span> <span class='dateTime'>${dateTime}</span> <span class='dayTemp'>${temp}${units}</span> <div class='dayHighLow'><span>H: ${high}${units}</span> <span>L : ${low}${units}</span> </div> <span class='dayDesc'>${description}<img src='${icon}'></span>`;

		fiveDayForecast.childNodes[3].append(displayDiv);
	});
}

//Scroll Control for Future Forecast Section
const scroll = document.getElementById("fiveDayScroll");
const fiveDayDivs = document.getElementById("fiveDayDisplays");
scroll.addEventListener("input", (scroll) => {
	let value = scroll.target.value;
	fiveDayDivs.style.right = value + "%";
});

//Control Scroll
const fiveDayArrow = Array.from(document.getElementsByClassName("fiveDayArrow"));
fiveDayArrow.forEach((x) => {
	x.addEventListener("click", () => {
		let index = fiveDayArrow.indexOf(x);
		if (index == 0) {
			scroll.value -= 12.5;
		}
		if (index == 1) {
			scroll.value = Number(scroll.value) + 12.5;
		}

		if (scroll.value > 75) {
			scroll.value = 75;
		} else if (scroll.value < 0) {
			scroll.value = 0;
		}

		fiveDayDivs.style.right = scroll.value + "%";
	});
});
