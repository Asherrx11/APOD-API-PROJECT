const myForm = document.querySelector('form');
const myDateInput = document.querySelector('#date');
const myApodContainer = document.querySelector('#apod-container');
const myFavoritesContainer = document.querySelector('#favorites-container');

myForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const selectedDate = myDateInput.value;

    try {
        const apodData = await fetchApodData(selectedDate);
        renderApodData(apodData);
    } catch (error) {
        console.error(error);
        alert('An error occurred. Please try again later.');
    }
});

async function fetchApodData(date) {
    const apiKey = 'PmWouVpGaU1gTP1gGxHvQKlTeHcJgBVtrtODNz2H';
    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function renderApodData(apodData) {
    const { title, date, explanation, url, hdurl = url } = apodData;

    const titleElement = document.createElement('h2');
    titleElement.textContent = title;

    const dateElement = document.createElement('p');
    dateElement.textContent = date;

    const explanationElement = document.createElement('p');
    explanationElement.textContent = explanation;

    const imageElement = document.createElement('img');
    imageElement.src = url;
    imageElement.style.width = '800px';
    imageElement.style.height = '500px';
    imageElement.style.position = 'relative';

    imageElement.addEventListener('click', () => {
        const popupContainer = document.createElement('div');
        popupContainer.style.position = 'absolute';
        popupContainer.style.top = '0';
        popupContainer.style.left = '0';
        popupContainer.style.width = '80%';
        popupContainer.style.height = '100%';
        popupContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        popupContainer.style.display = 'flex';
        popupContainer.style.justifyContent = 'center';
        popupContainer.style.alignItems = 'center';
        popupContainer.style.zIndex = '999';

        const popupImage = document.createElement('img');
        popupImage.src = hdurl;
        popupImage.style.maxWidth = '40%';
        popupImage.style.maxHeight = '70%';

        popupContainer.appendChild(popupImage);

        document.body.appendChild(popupContainer);

        popupContainer.addEventListener('click', () => {
            document.body.removeChild(popupContainer);
        });
    });

    myApodContainer.innerHTML = '';
    myApodContainer.appendChild(titleElement);
    myApodContainer.appendChild(dateElement);
    myApodContainer.appendChild(explanationElement);
    myApodContainer.appendChild(imageElement);

    const favoriteButton = document.createElement('button');
    favoriteButton.textContent = 'Add to Favorites';
    favoriteButton.addEventListener('click', () => {
        addToFavorites(apodData);
    });
    myApodContainer.appendChild(favoriteButton);
}

function addToFavorites(apod) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push(apod);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showFavorites();
}

function removeFromFavorites(apodUrl) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(favorite => favorite.url !== apodUrl);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showFavorites();
}

function showFavorites() {
    myFavoritesContainer.innerHTML = '';

    let favorites = JSON.parse(localStorage.getItem('favorites'));
    if (favorites === null || favorites.length === 0) {
        myFavoritesContainer.innerHTML = '<p>You have no favorites yet.</p>';
    } else {
        for (let i = 0; i < favorites.length; i++) {
            let favorite = favorites[i];

            let favoriteDiv = document.createElement('div');
            favoriteDiv.classList.add('favorite');

            let title = document.createElement('h2');
            title.innerText = favorite.title;
            favoriteDiv.appendChild(title);

            let description = document.createElement('p');
            description.innerText = favorite.description;
            favoriteDiv.appendChild(description);

            let url = document.createElement('a');
            url.setAttribute('href', favorite.url);
            url.innerText = 'Go to website';
            favoriteDiv.appendChild(url);

            let removeButton = document.createElement('button');
            removeButton.innerText = 'Remove from favorites';
            removeButton.addEventListener('click', function () {
                removeFavorite(i);
            });
            favoriteDiv.appendChild(removeButton);

            myFavoritesContainer.appendChild(favoriteDiv);
        }
    }
}

function removeFavorite(index) {
    let favorites = JSON.parse(localStorage.getItem('favorites'));
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showFavorites();
}

showFavorites(); 
