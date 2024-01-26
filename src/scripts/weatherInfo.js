const oWApi = "98cccf764149f70e06a6a27d3efe0a34";

async function getLatLong(query) {
	let finalQuery = "";
	query = query.split(",");
	query.forEach((x) => {
		x = x.trim().replaceAll(" ", "+");
		finalQuery = `${finalQuery}+${x}`;
	});
	setTimeout;
	const request = await fetch(`https://geocode.maps.co/search?q=${finalQuery.slice(1)}`);
	const response = await request.json();
	const lat = response[0].lat;
	const lon = response[0].lon;

	const locRequest = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
	const locResponse = await locRequest.json();

	const locState = locResponse.address.state;
	const locCountry = locResponse.address.country;
	const loc = { locState, locCountry };

	return { lat, lon, loc };
}

async function getWeatherInfo(query, forecast, units = "imperial", latLong) {
	const request = await fetch(`https://api.openweathermap.org/data/2.5/${forecast}?lat=${latLong.lat}&lon=${latLong.lon}&appid=${oWApi}&units=${units}`);

	let results = await request.json();

	switch (units) {
		case "imperial":
			units = ["°F", "mph"];
			break;
		case "standard":
			units = ["K", "m/s"];
			break;
		case "metric":
			units = ["°C", "m/s"];
			break;
	}

	let loc = latLong.loc;
	return { results, units, loc };
}

export async function getForecasts(query, units) {
	const latLong = await getLatLong(`${query}`);
	const fiveDay = await getWeatherInfo(query, "forecast", units, latLong);
	const current = await getWeatherInfo(query, "weather", units, latLong);
	return { fiveDay, current };
}
