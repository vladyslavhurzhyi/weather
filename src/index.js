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
  refs.searchSectionRef.classList.add('searchOnTop');
  isHiddenOff();
  try {
    const data = await weatherApi.getWeatherNow();
    refs.searchFormRef.reset();
    console.log(data);

    const { name, main, weather, wind } = data;

    refs.weatherNowCityRef.textContent = name;
    refs.weathernowTempRef.textContent = `${Math.round(main.temp)}°C`;
    refs.humidityValueNow.textContent = `${Math.round(main.humidity)}`;
    refs.pressureValueNow.textContent = `${Math.round(main.pressure)}`;
    refs.weathernowSkyRef.textContent = weather[0].main;
    refs.windValueNowRef.textContent = `${Math.round(wind.speed)}`;
  } catch (error) {
    console.log(error);
  } finally {
    deleteBlur();
    refs.spinnerRef.classList.add('is-hidden');
  }
}

function deleteBlur() {
  refs.blurRef.forEach(item => {
    item.classList.remove('blur');
  });
}

export function isHiddenOff() {
  refs.spinnerRef.classList.remove('is-hidden');
  refs.wperDayRef.classList.remove('is-hidden');
  refs.weatherWeekRef.classList.remove('is-hidden');
}
