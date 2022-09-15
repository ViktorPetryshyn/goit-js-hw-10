import './css/styles.css';
import debounce from 'lodash.debounce';
import  {Notify} from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './js/fetchCountries';
import listMurkup from './templates/countries-list.hbs';
import cardMurkum from './templates/country-card.hbs';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchField: document.querySelector('#search-box'),
  countriesList: document.querySelector('.country-list'),
  countryCard: document.querySelector('.country-info'),
};

refs.searchField.addEventListener(
  'input',
  debounce(searchCountries, DEBOUNCE_DELAY)
);

function searchCountries(e) {
  murkupReset();
  e.preventDefault();
  const searchQuery = e.target.value.trim();
  if (searchQuery === '') {
    murkupReset();
    return;
  }
  fetchCountries(searchQuery).then(creatingMurkupAfterCheking).catch(logError);


function creatingMurkupAfterCheking(countriesArray) {
  if (countriesArray.length > 10) {
    murkupReset();
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  if (countriesArray.length === 1) {
    renderCountryCard(countriesArray);
  } else {
    renderCountriesList(countriesArray);
  }
}
function renderCountriesList(countriesArray) {
  const countries = countriesArray.map(country => listMurkup(country)).join('');
  refs.countriesList.innerHTML = countries;
  }

function renderCountryCard(countriesArray) {
  const countries = countriesArray.map(country => cardMurkum(country)).join('');
  refs.countryCard.innerHTML = countries;
}
function logError(error) {
  if (error) {
    Notify.failure('Oops, there is no country with that name');
    refs.countriesList.innerHTML = '';
  }
}
function murkupReset() {
  refs.countriesList.innerHTML = '';
  refs.countryCard.innerHTML = '';
}