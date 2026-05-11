const IMG_URL = "https://image.tmdb.org/t/p/w500";
const movies = document.getElementById("movies");

//local storage for ratings

let ratings = JSON.parse(localStorage.getItem("ratings")) || [];

//rendering, sorted by rating and displaying comment and rating

function renderRatings(){
    movies.innerHTML = "";

    ratings
    .sort((a,b)=> b.rating - a.rating)
    .forEach(item => {

        const title = item.title || item.name;
        const poster = item.poster_path;

        const el = document.createElement("div");
        el.classList.add("movie");
        el.classList.add("ratingsMovie");

        el.innerHTML = `
            <div class="movie-card">
                <img src="${IMG_URL + poster}">
                <button class="remove">🗙</button>
            </div>

            <div class="h3">
                <h3>${title}</h3>
            </div>

            <div class="flexing ratingsFlexing">
                <span class="avg ratingsAvg">${item.rating}<span class="starRating">★</span></span>
            </div>
            <span class="comment">${item.comment || ""}</span>
        `;

        el.querySelector(".remove").addEventListener("click", () => {
            ratings = ratings.filter(r => r.id !== item.id);
            localStorage.setItem("ratings", JSON.stringify(ratings));
            renderRatings();
        });

        movies.appendChild(el);
    });
}

renderRatings();