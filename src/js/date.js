import { format } from 'date-fns';
import { refs } from './refs';

const dateNumber = format(new Date(), 'd');
const dayOfWeek = format(new Date(), 'eeee');
const monthAndNumber = format(new Date(), 'MMM');

export function setupDate() {
  refs.dayOfWeekRef.textContent = dayOfWeek;
  refs.monthAndDateRef.textContent = `${monthAndNumber} ${dateNumber}`;
}
