import axios from 'axios';

axios.defaults.baseURL = 'https://api.openweathermap.org/data/2.5/';

export class WeatherAPI {
  #api = '1ebe2741fc2dad72428940b7d498d033';
  #city = '';

  async getWeatherNow() {
    const urlAXSIOS = `weather?q=${this.#city}&appid=${this.#api}&units=metric`;

    const { data } = await axios.get(urlAXSIOS);

    return data;
  }

  async getWeatherFiveDay() {
    const urlAXSIOS = `forecast?q=${this.#city}&appid=${
      this.#api
    }&units=metric`;

    const { data } = await axios.get(urlAXSIOS);

    return data;
  }

  get city() {
    return this.#city;
  }

  set city(newCity) {
    this.#city = newCity;
  }
}
