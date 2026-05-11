const API_KEY = "33209a4777903f55932e0f4e0cae3133";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

let movies;
let pagination;
let ratingBox;

let currentPage = 1;
let currentGenre = "";
let moviesData = [];
let totalPages = 1;

let currentType = "movie";

let activeItem = null;

if (window.location.pathname.includes("shows")) {
    currentType = "tv";
} else if (window.location.pathname.includes("actors")) {
    currentType = "person";
}

let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
let ratings = JSON.parse(localStorage.getItem("ratings")) || [];

function saveWatchlist(){
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
}

function saveRatings(){
    localStorage.setItem("ratings", JSON.stringify(ratings));
}

function addRemove(item){
    const exists = watchlist.find(f => f.id === item.id);

    if (exists){
        watchlist = watchlist.filter(f => f.id !== item.id);
    } else {
        watchlist.push(item);
    }

    saveWatchlist();
    showContent();
}

function RateItem(item, value){
    const exists = ratings.find(r => r.id === item.id);

    if (exists){
        exists.rating = value;
    } else {
        ratings.push({
            ...item,
            type: currentType,
            rating: value
        });
    }

    saveRatings();
}

async function getContent(page = 1, genre = "") {

    let url = "";

    if (currentType == "person"){
        url = `${BASE_URL}/person/popular?api_key=${API_KEY}&page=${page}`;
    } else {
        url = `${BASE_URL}/discover/${currentType}?api_key=${API_KEY}&sort_by=vote_count.desc&page=${page}`;
    }

    if (genre && currentType != "person") {
        url += `&with_genres=${genre}`;
    }

    const res = await fetch(url);
    const data = await res.json();

    moviesData = data.results;
    totalPages = data.total_pages;

    showContent();
    createButtons();
}

function showContent() {

    movies.innerHTML = "";

    moviesData.forEach(item => {

        const existingRating = ratings.find(r => r.id === item.id && r.type === currentType);

        const title = currentType === "person" ? item.name : (item.title || item.name);
        const date = currentType === "person" ? null : (item.release_date || item.first_air_date);

        const year = date ? date.split("-")[0] : "N/A";

        const isFav = watchlist.some(f => f.id === item.id);

        const knownFor = currentType === "person"
            ? item.known_for
                .map(k => k.title || k.name)
                .slice(0, 3)
                .join("<br>")
            : "";

        const el = document.createElement("div");
        el.classList.add("movie");
        if (currentType === "person") el.style.height = "410px";
        el.innerHTML = `
            <div class="movie-card">
                <img src="${IMG_URL + (currentType === "person" ? item.profile_path : item.poster_path)}">
                <button class="fav">${currentType != "person" ? (isFav ? "★" : "☆") : ""}</button>
            </div>

            <div class="h3">
            <h3>${title}</h3>
            ${currentType === "person" ? `<p class="known">${knownFor}</p>` : ""}
            </div>

            <div class="flexing">
            <span class="year">${currentType === "person" ? "" : year}</span>

            <span class="rating">

                <span class="count">
                ${currentType === "person" ? "" : `(${item.vote_count || 0})`}
                </span>

                <span class="avg">
                ${currentType !== "person" ? `<button class="rate">★</button>` : ""}

                ${existingRating
                    ? existingRating.rating
                    : (currentType === "person"
                        ? ""
                        : item.vote_average.toFixed(1)
                    )
                }
                </span>

            </span>
            </div>
        `;

        const favBtn = el.querySelector(".fav");
        favBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            addRemove(item);
        });

        el.addEventListener("click", () => {
            if (currentType === "person") return;
            const type = currentType;
            window.location.href = `/details/?id=${item.id}&type=${type}`;
        });

        const rateBtn = el.querySelector(".rate");

        if (rateBtn) {
            rateBtn.onclick = (e) => {
                e.stopPropagation();
                const rect = el.getBoundingClientRect();
                openRatingBox(item, rect.left, rect.top + window.scrollY);
            };
        }

        movies.appendChild(el);
    });
}

function createButtons() {

    pagination.innerHTML = "";

    const start = currentPage;
    const end = Math.min(currentPage + 9, totalPages);

    const prev = document.createElement("button");
    prev.textContent = "<";

    prev.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            getContent(currentPage, currentGenre);
        }
    };

    pagination.appendChild(prev);

    for (let i = start; i <= end; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;

        if (i === currentPage) {
            btn.style.background = "#b20710";
        }

        btn.onclick = () => {
            currentPage = i;
            getContent(currentPage, currentGenre);
        };

        pagination.appendChild(btn);
    }

    const next = document.createElement("button");
    next.textContent = ">";

    next.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            getContent(currentPage, currentGenre);
        }
    };

    pagination.appendChild(next);
}

let tempRating = 0;

function openRatingBox(item, x, y){
    activeItem = item;

    if (currentType === "person") return;

    ratingBox.classList.remove("hidden");
    ratingBox.style.left = x + "px";
    ratingBox.style.top = y + "px";

    ratingBox.innerHTML = `
        <div class="stars">
            ${[1,2,3,4,5,6,7,8,9,10].map(n =>
                `<span class="star" data-value="${n}">★</span>`
            ).join("")}
        </div>
        <textarea id="comment" placeholder="Write comment..."></textarea>
        <button id="saveBtn">Save</button>
    `;

    const stars = ratingBox.querySelectorAll(".star");

    stars.forEach(star => {

        star.addEventListener("mouseover", () => {
            const val = star.dataset.value;
            stars.forEach(s => {
                s.classList.toggle("active", s.dataset.value <= val);
            });
        });

        star.addEventListener("click", () => {
            tempRating = star.dataset.value;
        });

        star.addEventListener("mouseout", () => {
            stars.forEach(s => {
                s.classList.toggle("active", s.dataset.value <= tempRating);
            });
        });
    });

    ratingBox.querySelector("#saveBtn").onclick = saveRating;
}

function saveRating(){
    const comment = document.getElementById("comment").value;

    const exists = ratings.find(r => r.id === activeItem.id);

    if (exists){
        exists.rating = tempRating;
        exists.comment = comment;
    } else {
        ratings.push({
            ...activeItem,
            type: currentType,
            rating: tempRating,
            comment: comment
        });
    }

    localStorage.setItem("ratings", JSON.stringify(ratings));
    ratingBox.classList.add("hidden");
}

async function searchMovies(q){

    const url = `${BASE_URL}/search/${currentType}?api_key=${API_KEY}&query=${q}`;
    const res = await fetch(url);
    const data = await res.json();

    moviesData = data.results;
    currentPage = 1;
    totalPages = 1;

    showContent();
    pagination.innerHTML = "";
}

document.addEventListener("DOMContentLoaded", () => {

    movies = document.getElementById("movies");
    pagination = document.getElementById("pagination");
    ratingBox = document.getElementById("ratingBox");

    const login = document.querySelector(".login-btn");
    const reg = document.querySelector(".reg-btn");

    if (login) login.addEventListener("click", () => window.location.href = "/login/");
    if (reg) reg.addEventListener("click", () => window.location.href = "/signup/");

    const selectMovie = document.getElementById("selectMovie");
    const searchInput = document.getElementById("input1");
    const searchBtn = document.querySelector(".search-btn");

    if (selectMovie) {
        selectMovie.addEventListener("change", () => {
            currentGenre = selectMovie.value;
            currentPage = 1;
            getContent(currentPage, currentGenre);
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            const q = searchInput.value.trim();
            if (!q) return;
            searchMovies(q);
        });
    }

    getContent();
});