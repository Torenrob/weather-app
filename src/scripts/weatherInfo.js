const oWApi = process.env.openWeatherApi;

async function getLatLong(query) {
	let finalQuery = "";
	query = query.split(",");
	query.forEach((x) => {
		x = x.trim().replaceAll(" ", "+");
		finalQuery = `${finalQuery}+${x}`;
	});
	const request = await fetch(`https://geocode.maps.co/search?q=${finalQuery.slice(1)}`);
	const response = await request.json();
	const lat = response[0].lat;
	const lon = response[0].lon;
	const loc = response[0].display_name;
	return { lat, lon, loc };
}

async function getWeatherInfo(query, forecast, units = "imperial") {
	const latLong = await getLatLong(`${query}`);
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

export async function getForecasts(query) {
	const fiveDay = await getWeatherInfo(query, "forecast");
	const current = await getWeatherInfo(query, "weather");

	return { fiveDay, current };
}
