const API_KEY = "33209a4777903f55932e0f4e0cae3133";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const movies = document.getElementById("movies");
const pagination = document.getElementById("pagination");

let currentPage = 1;
let moviesData = [];

let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
let ratings = JSON.parse(localStorage.getItem("ratings")) || [];

// SAVE WATCHLIST
function saveWatchlist(){
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
}

// SAVE RATINGS
function saveRatings(){
    localStorage.setItem("ratings", JSON.stringify(ratings));
}

// WATCHLIST
function addRemove(movie){
    const exists = watchlist.find(f => f.id === movie.id);

    if (exists){
        watchlist = watchlist.filter(f => f.id !== movie.id);
    } else {
        watchlist.push(movie);
    }

    saveWatchlist();
    showMovies();
}

// ⭐ RATING (FIXED)
function RateMovie(movie, value){
    const exists = ratings.find(r => r.id === movie.id);

    if (exists){
        exists.rating = value;
    } else {
        ratings.push({
            ...movie,
            rating: value
        });
    }

    saveRatings();
}

// FETCH MOVIES
async function getMovies(page = 1, genre = "") {
    const res = await fetch(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=vote_count.desc&page=${page}&with_genres=${genre}`
    );
    const data = await res.json();

    moviesData = data.results;

    showMovies();
    createButtons();
}

// SHOW MOVIES
function showMovies() {
    movies.innerHTML = "";
    const sliced = moviesData.slice(0, 50);

    sliced.forEach(movie => {
        const { title, poster_path, release_date, vote_average, vote_count } = movie;

        const year = release_date ? release_date.split("-")[0] : "N/A";

        const isFav = watchlist.some(f => f.id === movie.id);

        const el = document.createElement("div");
        el.classList.add("movie");

        el.innerHTML = `
            <div class="movie-card">
                <img src="${IMG_URL + poster_path}">
                <button class="fav">${isFav ? "★" : "☆"}</button>
            </div>

            <div class="h3">
              <h3>${title}</h3>
            </div>

            <div class="flexing">
              <span class="year">${year}</span>
              <span class="rating">
                <span class="count">(${vote_count.toLocaleString()})</span>
                <span class="avg">
                  <button class="rate">⭐</button>
                  ${vote_average.toFixed(1)}
                </span>
              </span>
            </div>
        `;

        // WATCHLIST
        el.querySelector(".fav").addEventListener("click", () => {
            addRemove(movie);
        });

        // ⭐ RATING EVENT (BITNO)
        el.querySelector(".rate").addEventListener("click", () => {
            const value = prompt("Rate movie 1-10:");

            const rating = Number(value);

            if (rating >= 1 && rating <= 10) {
                RateMovie(movie, rating);
            }
        });

        movies.appendChild(el);
    });
}

// WATCHLIST PAGE
function showWatchlistPage() {
    movies.innerHTML = "";

    watchlist.forEach(movie => {
        const { title, poster_path } = movie;

        const el = document.createElement("div");
        el.classList.add("movie");

        el.innerHTML = `
            <div class="movie-card">
                <img src="${IMG_URL + poster_path}">
                <button class="fav">★</button>
            </div>
            <h3>${title}</h3>
        `;

        el.querySelector(".fav").addEventListener("click", () => {
            addRemove(movie);
            showWatchlistPage();
        });

        movies.appendChild(el);
    });
}

// PAGINATION
function createButtons() {
    pagination.innerHTML = "";

    const prev = document.createElement("button");
    prev.textContent = "<";

    prev.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            getMovies(currentPage);
        }
    };

    const next = document.createElement("button");
    next.textContent = ">";

    next.onclick = () => {
        currentPage++;
        getMovies(currentPage);
    };

    pagination.appendChild(prev);
    pagination.appendChild(next);
}

// INIT
getMovies();

const selectMovie = document.getElementById("selectMovie");

selectMovie.addEventListener("change", () => {
    const genreID = selectMovie.value;
    currentPage = 1;
    getMovies(currentPage, genreID);
});