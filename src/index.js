import { format, add, parseISO } from 'date-fns';
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
    renderWeekData(list);

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

export function renderWeekData(list) {
  const dateNow = new Date();
  const formatDate = 'yyyy-MM-dd';
  const in1DaysAfter = format(add(dateNow, { days: 1 }), formatDate);
  const in2DaysAfter = format(add(dateNow, { days: 2 }), formatDate);
  const in3DaysAfter = format(add(dateNow, { days: 3 }), formatDate);
  const in4DaysAfter = format(add(dateNow, { days: 4 }), formatDate);
  const in5DaysAfter = format(add(dateNow, { days: 5 }), formatDate);

  const allDayOfWeek = [
    in1DaysAfter,
    in2DaysAfter,
    in3DaysAfter,
    in4DaysAfter,
    in5DaysAfter,
  ];
  const weekDay = [];
  refs.weatherWeekWeekday.forEach(day => {
    weekDay.push(day.textContent);
  });
  for (let index = 0; index < allDayOfWeek.length; index += 1) {
    weekDay[index] = String(parseISO(allDayOfWeek[index])).slice(0, 4);
  }
  refs.weatherWeekWeekday.forEach((day, index) => {
    day.textContent = weekDay[index];
  });

  const weekDate = [];
  refs.weatherWeekWeekdate.forEach(item => {
    weekDate.push(item.textContent);
  });
  for (let index = 0; index < allDayOfWeek.length; index += 1) {
    weekDate[index] = String(parseISO(allDayOfWeek[index])).slice(4, 11);
  }
  refs.weatherWeekWeekdate.forEach((item, index) => {
    item.textContent = weekDate[index];
  });
  ////
  const night = '00:00:00';
  const morning = '09:00:00';
  const day = '12:00:00';
  const evening = '18:00:00';

  const jsWeekValueMinRef = document.querySelectorAll('.js-week-value-min');
  const jsWeekValueMaxRef = document.querySelectorAll('.js-week-value-max');
  weatherWeek(jsWeekValueMinRef, night, allDayOfWeek, list);
  weatherWeek(jsWeekValueMaxRef, day, allDayOfWeek, list);

  function weatherWeek(referens, timeOfDay, allDayOfWeek, list) {
    const weatherWeekData = [];
    list.forEach(data => {
      allDayOfWeek.forEach(item => {
        if (data.dt_txt == item + ' ' + timeOfDay) {
          weatherWeekData.push(data.main.temp_min);
        }
      });
    });

    referens.forEach((item, index) => {
      if (weatherWeekData[index] > 0) {
        item.textContent = '+' + String(weatherWeekData[index]).slice(0, 4);
      } else {
        item.textContent = String(weatherWeekData[index]).slice(0, 4);
      }
    });
  }
}
