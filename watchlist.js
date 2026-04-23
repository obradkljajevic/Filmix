const API_KEY = "33209a4777903f55932e0f4e0cae3133";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const movies = document.getElementById("movies");

let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

//watchlist rendering

function renderWatchlist() {
    movies.innerHTML = "";

    if (watchlist.length === 0) {
        movies.innerHTML = "<p>You don't have anything on watchlist.</p>";
        return;
    }

    watchlist.forEach(item => {

        const title = item.title || item.name;
        const date = item.release_date || item.first_air_date;
        const year = date ? date.split("-")[0] : "N/A";

        const poster_path = item.poster_path;
        const vote_average = item.vote_average;
        const vote_count = item.vote_count;

        const el = document.createElement("div");
        
        el.classList.add("movie");

        el.innerHTML = `
            <div class="movie-card">
                <img src="${IMG_URL + poster_path}">
                <button class="fav">★</button>
            </div>
            <div class="h3">
              <h3>${title}</h3>
            </div>
            <div class="flexing">
              <span class="year">${year}</span>
              <span class="rating">
                <span class="count">(${vote_count || 0})</span>
                <span class="avg"><span class="starRating">★</span>${vote_average ? vote_average.toFixed(1) : "0.0"}</span>
              </span>
            </div>
        `;

        el.querySelector(".fav").addEventListener("click", () => {
            watchlist = watchlist.filter(f => f.id !== item.id);
            localStorage.setItem("watchlist", JSON.stringify(watchlist));
            renderWatchlist();
        });

        movies.appendChild(el);
    });
}

renderWatchlist();