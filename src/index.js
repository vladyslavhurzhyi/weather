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

    renderIconMain(data);

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

let listFiveDay;

async function weatherFiveDay() {
  try {
    const { list } = await weatherApi.getWeatherFiveDay();

    listFiveDay = list;

    renderTimeOnHour(list);

    // _____
    renderTempOnHour(list);

    ///
    renderWeekData(list);

    /////
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

////////
//из renderWeekData(list)

const dateNow = new Date();
const formatDate = 'yyyy-MM-dd';
const in1DaysAfter = format(add(dateNow, { days: 1 }), formatDate);
const in2DaysAfter = format(add(dateNow, { days: 2 }), formatDate);
const in3DaysAfter = format(add(dateNow, { days: 3 }), formatDate);
const in4DaysAfter = format(add(dateNow, { days: 4 }), formatDate);

const allDayOfWeek = [in1DaysAfter, in2DaysAfter, in3DaysAfter, in4DaysAfter];

const nightMorDayEven = {
  night: '00:00:00',
  morning: '09:00:00',
  day: '12:00:00',
  evening: '18:00:00',
};

let list;
///////

export function renderWeekData(list) {
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

  const jsWeekValueMinRef = document.querySelectorAll('.js-week-value-min');
  const jsWeekValueMaxRef = document.querySelectorAll('.js-week-value-max');
  weatherWeek(jsWeekValueMinRef, nightMorDayEven.night, allDayOfWeek, list);
  weatherWeek(jsWeekValueMaxRef, nightMorDayEven.day, allDayOfWeek, list);

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
        item.textContent = '+' + weatherWeekData[index].toFixed(0) + '℃';
      } else {
        item.textContent = weatherWeekData[index].toFixed(0) + '℃';
      }
    });
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getAndRenderWeatherFour(
    refs.weatherWeekSquare,
    allDayOfWeek,
    nightMorDayEven,
    list
  );
}

export function getAndRenderWeatherFour(
  referense,
  allDayOfWeek,
  nightMorDayEven,
  list
) {
  let weekData = [];
  referense.forEach(item => {
    weekData.push(item);
  });
  for (let index = 0; index < allDayOfWeek.length; index += 1) {
    weekData[index].dataset.calendarData = allDayOfWeek[index];
  }

  let weatherOnNight;
  let weatherOnMorning;
  let weatherOnDay;
  let weatherOnEvening;

  referense.forEach(item => {
    if (item.classList.contains('is-active')) {
      weatherOnNight = `${item.dataset.calendarData} ${nightMorDayEven.night}`;
      weatherOnMorning = `${item.dataset.calendarData} ${nightMorDayEven.morning}`;
      weatherOnDay = `${item.dataset.calendarData} ${nightMorDayEven.day}`;
      weatherOnEvening = `${item.dataset.calendarData} ${nightMorDayEven.evening}`;
    }
  });
  let currentDataNigth = list.find(item => {
    return item.dt_txt == weatherOnNight;
  });

  renderWeatherOn4Time(
    refs.jsNightDataTemp,
    refs.jsNightDataFeels,
    refs.jsNightDataMps,
    refs.jsNightDataHummid,
    refs.jsNightDataPressure,
    currentDataNigth
  );

  let currentDataDay = list.find(item => {
    return item.dt_txt == weatherOnDay;
  });

  renderWeatherOn4Time(
    refs.jsDayDataTemp,
    refs.jsDayDataFeels,
    refs.jsDayDataMps,
    refs.jsDayDataHummid,
    refs.jsDayDataPressure,
    currentDataDay
  );

  let currentDataMorning = list.find(item => {
    return item.dt_txt == weatherOnMorning;
  });

  renderWeatherOn4Time(
    refs.jsMorningDataTemp,
    refs.jsMorningDataFeels,
    refs.jsMorningDataMps,
    refs.jsMorningDataHummid,
    refs.jsMorningDataPressure,
    currentDataMorning
  );

  let currentDataEvening = list.find(item => {
    return item.dt_txt == weatherOnEvening;
  });

  renderWeatherOn4Time(
    refs.jsEveningDataTemp,
    refs.jsEveningDataFeels,
    refs.jsEveningDataMps,
    refs.jsEveningDataHummid,
    refs.jsEveningDataPressure,
    currentDataEvening
  );

  function renderWeatherOn4Time(
    tempRef,
    feelsRef,
    mpsRef,
    humidityRef,
    pressureRef,
    currentData
  ) {
    if (currentData.main.temp > 0) {
      tempRef.textContent = '+' + currentData.main.temp.toFixed(0) + '℃';
    } else {
      tempRef.textContent = currentData.main.temp.toFixed(0) + '℃';
    }
    //Feels like
    if (currentData.main.feels_like > 0) {
      feelsRef.textContent = '+' + currentData.main.feels_like.toFixed(0) + '℃';
    } else {
      feelsRef.textContent = currentData.main.feels_like.toFixed(0) + '℃';
    }
    //wind.speed
    mpsRef.textContent = currentData.wind.speed;
    //  main.humidity
    humidityRef.textContent = currentData.main.humidity;
    // main.pressure
    pressureRef.textContent = currentData.main.pressure;
  }
}

// ///
refs.weatherWeekSquare.forEach(item => {
  item.addEventListener('click', turnIsActive);
});

export function turnIsActive(event) {
  refs.weatherWeekSquare.forEach(item => {
    if (item.classList.contains('is-active')) {
      item.classList.remove('is-active');
    }
  });
  event.currentTarget.classList.add('is-active');

  getAndRenderWeatherFour(
    refs.weatherWeekSquare,
    allDayOfWeek,
    nightMorDayEven,
    listFiveDay
  );
}

////
export function renderIconMain(data) {
  console.log(data);

  let icon = data.weather[0].icon;

  switch (icon) {
    case '01d':
      break;

    default:
      refs.mainIcon.setAttribute('srcset', '01n-1x.png 1x, 01n-1x.png 2x');
      break;
  }

  console.log(refs.mainIcon.attributes);
}
