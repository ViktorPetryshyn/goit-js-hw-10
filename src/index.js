import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import data from './js/api';
// import listMurkup from './templates/country-info.hbs';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchField: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchField.addEventListener(
  'input',
  debounce(searchCountries, DEBOUNCE_DELAY)
);

function searchCountries(e) {
  e.preventDefault();
  searchQuery = e.target.value.trim();
  if (searchQuery === '') {
    refs.countryList.innerHTML = '';
    return;
  }
  data
    .fetchCountries(searchQuery)
    .then(creatingMurkupAfterCheking)
    .catch(logError);
}

// function renderCountriesList(countriesArray) {
//     const countries = countriesArray.map(countries => countries);   не могу сделать так что бы перебрало массив, а потом добавило розметку через готовый шаблон
//     refs.countryList.innerHTML = listMurkup(countries);
// }

function creatingMurkupAfterCheking(countriesArray) {
  if (countriesArray.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  if (countriesArray.length === 1) {
    renderCountryCard(countriesArray);
  } else {
    renderCountriesList(countriesArray);
  }
}

function renderCountriesList(countries) {
  const murkup = countries
    .map(({ flags, name }) => {
      return `<li>
    <img class="flag" src='${flags.svg}' alt='flag' />
    <span class="name">${name.official}</span>
</li>`;
    })
    .join('');
  refs.countryList.innerHTML = murkup;
}

function renderCountryCard(countries) {
  const murkup = countries
    .map(({ flags, name, capital, population, languages }) => {
      return `<div><li>
    <img class="flag" src='${flags.svg}' alt='flag' />
    <span>${name.official}</span>
    </div>
    <div class="meta">
    <p class="meta-info"><span class="meta-info__title">Capital:</span> ${capital}</p>
    <p class="meta-info"><span class="meta-info__title">Population:</span> ${population}</p>
    <p class="meta-info"><span class="meta-info__title">Languages:</span> ${Object.values(
      languages
    ).join(', ')}</p>
    </div> 
</li>`;
    })
    .join('');
  refs.countryList.innerHTML = murkup;
}
function logError(error) {
  if (error) {
    Notify.failure('Oops, there is no country with that name');
    refs.countryList.innerHTML = '';
  }
}
