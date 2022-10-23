import el from 'date-fns/esm/locale/el/index.js';
import { format } from 'date-fns';
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
    await weatherFiveDay();

    refs.searchFormRef.reset();

    isHiddenOff();
    refs.searchSectionRef.classList.add('searchOnTop');
    deleteBlur();

    const { name, main, weather, wind } = data;

    refs.weatherNowCityRef.textContent = name;
    refs.weathernowTempRef.textContent = `${Math.round(main.temp)}°C`;
    refs.humidityValueNow.textContent = `${Math.round(main.humidity)}`;
    refs.pressureValueNow.textContent = `${Math.round(main.pressure)}`;
    refs.weathernowSkyRef.textContent = weather[0].main;
    refs.windValueNowRef.textContent = wind.speed;
  } catch (error) {
    // console.log(error);
    refs.notifyRef.classList.remove('is-hidden');
    setTimeout(() => {
      refs.notifyRef.classList.add('is-hidden');
    }, 2000);
    return;
  } finally {
    refs.spinnerRef.classList.add('is-hidden');
  }
}

async function weatherFiveDay() {
  try {
    const { list } = await weatherApi.getWeatherFiveDay();
    renderTimeOnHour(list);

    // _____
    renderTempOnHour(list);

    ///

    // renderWeekData(list);

    console.log(list);
  } catch (error) {
    console.log(error);
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

export function renderTimeOnHour(list) {
  const timeOnPage = [];
  refs.byTimeHours.forEach(time => {
    timeOnPage.push(time.textContent);
  });

  for (let index = 0; index < timeOnPage.length; index += 1) {
    let newTime = [];
    list.forEach(timeData => newTime.push(timeData.dt_txt.slice(11, 16)));

    timeOnPage[index] = newTime[index];
  }

  refs.byTimeHours.forEach((time, index) => {
    time.textContent = timeOnPage[index];
  });
}

export function renderTempOnHour(list) {
  const tempOnPage = [];
  refs.byTimeTemp.forEach(item => {
    tempOnPage.push(item.textContent);
  });

  for (let index = 0; index < tempOnPage.length; index += 1) {
    let newTemp = [];

    list.forEach(tempData => newTemp.push(Math.round(tempData.main.temp)));

    tempOnPage[index] = newTemp[index];
  }

  refs.byTimeTemp.forEach((item, index) => {
    item.textContent = tempOnPage[index] + '℃';
  });
}

// _____

// export function renderWeekData(list) {
//   const dataNow = list[0].dt;

//   const dataTomorow = dataNow + 86400 * 1000;

//   console.log(dataTomorow);

//   // const nightTime = '00:00:00';
//   // const morningTime = '09:00:00';
//   // const dayTime = '12:00:00';
//   // const eveningTime = '18:00:00';

//   const dateTomorrowNight = format(
//     Date(dataTomorow),
//     'yyyy' + '-' + 'M' + '-' + 'd' + ' ' + '00:00:00'
//   );

//   console.log(dateTomorrowNight);
// }
