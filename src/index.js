import debounce from 'lodash/debounce';
import Notiflix from 'notiflix';
import './css/styles.css';
import fetchCountries from './fetchCountries';
const inputRef = document.getElementById('search-box');
const countryListRef = document.querySelector('.country-list');
const DEBOUNCE_DELAY = 300;

inputRef.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
    const searchQuery = event.target.value.trim();
    fetchCountries(searchQuery)
        .then(data => {
            if (data.length > 10) {
            reset();
            Notiflix.Notify.failure('Too many matches found. Please enter a more specific name.');
        }
            if (data.length >= 2 && data.length <= 10) {
                reset();
                createListOfCountries(data);
          
        }
        if (data.length === 1) {
            reset();
            createOneCountry(data);
            
        }
        if (searchQuery === '') {
            reset();
            return;
        }
    
        })
        .catch(error => {
            reset();
            return Notiflix.Notify.failure('Oops, there is no country with that name');
     
    })
}

function createListOfCountries(data) {
    const markup = data.map(({ name, flags }) => `
            <ul class="country-list">
                <li class="country-item">
                    <div class="country-about">
                        <img src="${flags.svg}" class="country-image">
                        <h1 class="country-title">${name.official}</h1>
                    </div>
                </li>
            </ul>
            
            `).join(" ");
            countryListRef.insertAdjacentHTML('beforeend', markup);
}

function createOneCountry(data) {
    const markup = data.map(({ flags, name, capital, population, languages }) => `
            <ul class="country-list">
                <li class="country-item">
                    <div class="country-about">
                        <img src="${flags.svg}" class="country-image">
                        <h1 class="country-title">${name.official}</h1>
                    </div>
                    <div class="country-info">
                        <p class="country-text"><span class="country-span">Capital:</span> ${capital}</p>
                        <p class="country-text"><span class="country-span">Population:</span> ${population}</p>
                        <p class="country-text"><span class="country-span">Languages:</span> ${Object.values(languages)}</p>
                    </div>
                    
                </li>
            </ul>
            `).join(" ");
            countryListRef.insertAdjacentHTML('beforeend', markup);
}
function reset() {
    countryListRef.innerHTML = '';
}
