const API_KEY = "33209a4777903f55932e0f4e0cae3133";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const movies = document.getElementById("movies");
const pagination = document.getElementById("pagination");

let currentPage = 1;
let moviesData = [];

async function getMovies(page = 1) {
    const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=vote_count.desc&page=${page}`);
    const data = await res.json();

    moviesData = data.results;

    showMovies();
    createButtons();
}

function showMovies() {
    movies.innerHTML = "";
    const sliced = moviesData.slice(0,50);

    sliced.forEach(movie => {
        const { title, poster_path, release_date, vote_average, vote_count } = movie;

        const year = release_date ? release_date.split("-")[0] : "N/A";

        const el = document.createElement("div");
        el.classList.add("movie");

        el.innerHTML = `
            <img src="${IMG_URL + poster_path}">
            <div class="h3">
              <h3>${title}</h3>
            </div>
            <div class="flexing">
              <span class="year">${year}</span>
              <span class="rating"><span class="count">(${vote_count.toLocaleString()})</span><span class="avg">⭐${vote_average.toFixed(1)}</span></span>
            </div>
        `;

        movies.appendChild(el);
    });
}

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

getMovies();