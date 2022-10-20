import el from 'date-fns/esm/locale/el/index.js';
import { WeatherAPI } from './js/API';
import { setupDate } from './js/date';
import { refs } from './js/refs';

const weatherApi = new WeatherAPI();
//
setupDate();
//

const handleSubmit = async event => {
  event.preventDefault();

  const {
    elements: { searchQuery },
  } = event.currentTarget;

  const city = searchQuery.value.trim().toLowerCase();

  weatherApi.city = city;

  await weatherNow();
};

refs.searchFormRef.addEventListener('submit', handleSubmit);

async function weatherNow() {
  try {
    const data = await weatherApi.getWeatherNow();
    console.log(data);

    const { name, main, weather, wind } = data;

    refs.weatherNowCityRef.textContent = name;
    refs.weathernowTempRef.textContent = `${Math.round(main.temp)}°C`;
    refs.weathernowSkyRef.textContent = weather[0].main;
  } catch (error) {
    console.log(error);
  }
}
