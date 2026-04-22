const IMG_URL = "https://image.tmdb.org/t/p/w500";
const movies = document.getElementById("movies");

let ratings = JSON.parse(localStorage.getItem("ratings")) || [];

function renderRatings(){
    movies.innerHTML = "";

    ratings.forEach(movie => {
        const el = document.createElement("div");
        el.classList.add("movie");

        el.innerHTML = `
            <div class="movie-card">
                <img src="${IMG_URL + movie.poster_path}">
            </div>

            <div class="h3">
                <h3>${movie.title}</h3>
            </div>

            <div class="flexing">
                <span class="avg">${movie.rating}/10⭐</span>
            </div>

            <button class="remove">Remove</button>
        `;

        el.querySelector(".remove").addEventListener("click", () => {
            ratings = ratings.filter(r => r.id !== movie.id);
            localStorage.setItem("ratings", JSON.stringify(ratings));
            renderRatings();
        });

        movies.appendChild(el);
    });
}

renderRatings();