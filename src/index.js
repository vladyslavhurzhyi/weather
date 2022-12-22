export * from "./snow/snow";
import { format, add, parseISO, } from 'date-fns';
import { WeatherAPI } from './js/API';
import { setupDate } from './js/date';
import { refs } from './js/refs';
import icon01n from './svg/01n-1x.png';
import icon01d from './svg/01d-1x.png';
import icon02d from './svg/02d-1x.png';
import icon02n from './svg/02n-1x.png';
import icon03dn from './svg/03dn-1x.png';
import icon09dn from './svg/09dn-1x.png';
import icon11dn from './svg/11d-1x.png';
import icon13dn from './svg/13dn.png';

const weatherApi = new WeatherAPI();
//
setupDate();
//




export const iconWeather = [
  { id: '01d', name: icon01d },
  { id: '01n', name: icon01n },
  { id: '02d', name: icon02d },
  { id: '02n', name: icon02n },
  { id: '03d', name: icon03dn },
  { id: '03n', name: icon03dn },
  { id: '04d', name: icon03dn },
  { id: '04n', name: icon03dn },
  { id: '09d', name: icon09dn },
  { id: '09n', name: icon09dn },
  { id: '10d', name: icon09dn },
  { id: '10n', name: icon09dn },
  { id: '11d', name: icon11dn },
  { id: '11n', name: icon11dn },
  { id: '13d', name: icon13dn },
  { id: '13n', name: icon13dn },
];

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
       refs.searchSectionRef.classList.add('searchOnTop');
    refs.spinnerRef.classList.remove('is-hidden');
    const data = await weatherApi.getWeatherNow();
    await weatherFiveDay();


    renderIconMainAndBg(data.weather[0].icon, refs.mainIcon);

    refs.searchFormRef.reset();

    isHiddenOff();
 
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
const data = await weatherApi.getWeatherFiveDay();
    listFiveDay = list;

    renderTimeOnHour(data);

    // _____
    renderTempOnHour(list);

    renderIconOnHour(list);

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
  
  refs.wperDayRef.classList.remove('is-hidden');
  refs.weatherWeekRef.classList.remove('is-hidden');
}



export function renderTimeOnHour(data) {


  const { city, list } = data;
  const timeZone = city.timezone;


  const time = list.map((item => {

    return format(new Date((item.dt-timeZone)*1000), "HH-mm"); 
  }))
  const timeOnPage = time.slice(0, 7);


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

export function renderIconOnHour(list) {


  
  let icon = [];

  for (let index = 0; index < 8; index += 1) {
    let newIcon = [];

    list.forEach(({ weather } = list) => newIcon.push(weather[0].icon));

    icon.push(newIcon);
  }

 let iconData = icon[0].slice(0, 7);

  

    refs.byTimeIcon.forEach((item, index) => {
  renderIconMain(iconData[index], item)
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
  weatherWeek(jsWeekValueMinRef, nightMorDayEven.night, allDayOfWeek, list, refs.jsWeekIcon);
  weatherWeek(jsWeekValueMaxRef, nightMorDayEven.day, allDayOfWeek, list, refs.jsWeekIcon);

 

  function weatherWeek(referens, timeOfDay, allDayOfWeek, list, refsIcon) {
    const weatherWeekData = [];
    const iconWeek = [];
    list.forEach(data => {
      allDayOfWeek.forEach(item => {
        if (data.dt_txt == item + ' ' + timeOfDay) {
          weatherWeekData.push(data.main.temp_min);
          iconWeek.push(data.weather[0].icon);
        }
      });
    });
 
    
     refsIcon.forEach((item, index) => {
  renderIconMain(iconWeek[index], item)
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
    currentDataNigth,
    refs.jsIconNight
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
    currentDataDay,
    refs.jsIconDay
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
    currentDataMorning,
    refs.jsIconMorning
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
    currentDataEvening,
    refs.jsIconEvening
  );

  function renderWeatherOn4Time(
    tempRef,
    feelsRef,
    mpsRef,
    humidityRef,
    pressureRef,
    currentData,
    iconRef
  ) {


    renderIconMain(currentData.weather[0].icon, iconRef)
    

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
export function renderIconMain(data, refsIcon) {


  switch (data) {
    
    case '01d':
      refsIcon.setAttribute(
        'srcset',
        `${icon01d + ' 1x,' + icon01d + ' 2x'}`
      );
      break;

    case '01n':
    
      refsIcon.setAttribute(
        'srcset',
        `${icon01n + ' 1x,' + icon01n + ' 2x'}`
      );
      break;

    case '02d':
      refsIcon.setAttribute(
        'srcset',
        `${icon02d + ' 1x,' + icon02d + ' 2x'}`
      );
      break;

    case '02n':
  
      refsIcon.setAttribute(
        'srcset',
        `${icon02n + ' 1x,' + icon02n + ' 2x'}`
      );
      break;

    case '03d':
      refsIcon.setAttribute(
        'srcset',
        `${icon03dn + ' 1x,' + icon03dn + ' 2x'}`
      );
      break;

    case '03n':

      refsIcon.setAttribute(
        'srcset',
        `${icon03dn + ' 1x,' + icon03dn + ' 2x'}`
      );
      break;

    case '04d':
      refsIcon.setAttribute(
        'srcset',
        `${icon03dn + ' 1x,' + icon03dn + ' 2x'}`
      );
      break;

    case '04n':
  
      refsIcon.setAttribute(
        'srcset',
        `${icon03dn + ' 1x,' + icon03dn + ' 2x'}`
      );
      break;

    case '09d':
    
      refsIcon.setAttribute(
        'srcset',
        `${icon09dn + ' 1x,' + icon09dn + ' 2x'}`
      );
      break;

    case '09n':

      refsIcon.setAttribute(
        'srcset',
        `${icon09dn + ' 1x,' + icon09dn + ' 2x'}`
      );
      break;

    case '10d':
      refsIcon.setAttribute(
        'srcset',
        `${icon09dn + ' 1x,' + icon09dn + ' 2x'}`
      );
      break;

    case '10n':

      refsIcon.setAttribute(
        'srcset',
        `${icon09dn + ' 1x,' + icon09dn + ' 2x'}`
      );
      break;

    case '11d':
      refsIcon.setAttribute(
        'srcset',
        `${icon11dn + ' 1x,' + icon11dn + ' 2x'}`
      );
      break;

    case '11n':
    
      refsIcon.setAttribute(
        'srcset',
        `${icon11dn + ' 1x,' + icon11dn + ' 2x'}`
      );
      break;

    case '13d':
  
      refsIcon.setAttribute(
        'srcset',
        `${icon13dn + ' 1x,' + icon13dn + ' 2x'}`
      );
      break;

    case '13n':
      refsIcon.setAttribute(
        'srcset',
        `${icon13dn + ' 1x,' + icon13dn + ' 2x'}`
      );
      break;

    default:
      refsIcon.setAttribute(
        'srcset',
        `${icon03dn + ' 1x,' + icon03dn + ' 2x'}`
      );
      break;
  }
}




///render icon main + bg

export function renderIconMainAndBg(data, refsIcon) {

  refs.snow.classList.add("is-hidden")
  refs.mainWeatherNow.classList.remove("bgNightRain", "bgNight", "bgSnow")
  switch (data) {
    
    case '01d':
      refs.mainWeatherNow.classList.add("bgDay")
      refsIcon.setAttribute(
        'srcset',
        `${icon01d + ' 1x,' + icon01d + ' 2x'}`
      );
      break;

    case '01n':
      refs.mainWeatherNow.classList.add("bgNight")
      refsIcon.setAttribute(
        'srcset',
        `${icon01n + ' 1x,' + icon01n + ' 2x'}`
      );
      break;

    case '02d':
      refs.mainWeatherNow.classList.add("bgDay")
      refsIcon.setAttribute(
        'srcset',
        `${icon02d + ' 1x,' + icon02d + ' 2x'}`
      );
      break;

    case '02n':
      refs.mainWeatherNow.classList.add("bgNight")
      refsIcon.setAttribute(
        'srcset',
        `${icon02n + ' 1x,' + icon02n + ' 2x'}`
      );
      break;

    case '03d':
      refs.mainWeatherNow.classList.add("bgDay")
      refsIcon.setAttribute(
        'srcset',
        `${icon03dn + ' 1x,' + icon03dn + ' 2x'}`
      );
      break;

    case '03n':
      refs.mainWeatherNow.classList.add("bgNight")
      refsIcon.setAttribute(
        'srcset',
        `${icon03dn + ' 1x,' + icon03dn + ' 2x'}`
      );
      break;

    case '04d':
      refs.mainWeatherNow.classList.add("bgDay")
      refsIcon.setAttribute(
        'srcset',
        `${icon03dn + ' 1x,' + icon03dn + ' 2x'}`
      );
      break;

    case '04n':
         refs.mainWeatherNow.classList.add("bgNight")
      refsIcon.setAttribute(
        'srcset',
        `${icon03dn + ' 1x,' + icon03dn + ' 2x'}`
      );
      break;

    case '09d':
    refs.mainWeatherNow.classList.add("bgDay")
      refsIcon.setAttribute(
        'srcset',
        `${icon09dn + ' 1x,' + icon09dn + ' 2x'}`
      );
      break;

    case '09n':
      refs.mainWeatherNow.classList.add("bgNightRain")
      refsIcon.setAttribute(
        'srcset',
        `${icon09dn + ' 1x,' + icon09dn + ' 2x'}`
      );
      break;

    case '10d':
      refs.mainWeatherNow.classList.add("bgDay")
      refsIcon.setAttribute(
        'srcset',
        `${icon09dn + ' 1x,' + icon09dn + ' 2x'}`
      );
      break;

    case '10n':
           refs.mainWeatherNow.classList.add("bgNightRain")
      refsIcon.setAttribute(
        'srcset',
        `${icon09dn + ' 1x,' + icon09dn + ' 2x'}`
      );
      break;

    case '11d':
      refs.mainWeatherNow.classList.add("bgDayRain")
      refsIcon.setAttribute(
        'srcset',
        `${icon11dn + ' 1x,' + icon11dn + ' 2x'}`
      );
      break;

    case '11n':
      refs.mainWeatherNow.classList.add("bgNightRain")
      refsIcon.setAttribute(
        'srcset',
        `${icon11dn + ' 1x,' + icon11dn + ' 2x'}`
      );
      break;

    case '13d':
     refs.snow.classList.remove("is-hidden")
       refs.mainWeatherNow.classList.add("bgSnow")
      refsIcon.setAttribute(
        'srcset',
        `${icon13dn + ' 1x,' + icon13dn + ' 2x'}`
      );
      break;

    case '13n':
      refs.snow.classList.remove("is-hidden")
      refs.mainWeatherNow.classList.add("bgSnow")
      refsIcon.setAttribute(
        'srcset',
        `${icon13dn + ' 1x,' + icon13dn + ' 2x'}`
      );
      break;

    default:
      refsIcon.setAttribute(
        'srcset',
        `${icon03dn + ' 1x,' + icon03dn + ' 2x'}`
      );
      break;
  }
}
