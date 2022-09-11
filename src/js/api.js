function fetchCountries(query) {
  return fetch(
    `https://restcountries.com/v3.1/name/${query}?fields=name,capital,population,flags,languages`
  ).then(request => request.json());
}
export default { fetchCountries };
