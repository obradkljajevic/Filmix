const API_KEY = "33209a4777903f55932e0f4e0cae3133";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/original";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const type = params.get("type");

const details = document.getElementById("details");

//Load function for more details about movie

async function loadDetails() {

    const res = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}`);
    const data = await res.json();

    const creditsRes = await fetch(`${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}`);
    const credits = await creditsRes.json();

    details.innerHTML = `
        <div class="backdrop">
            <img src="${IMG_URL + data.backdrop_path}">
        </div>

        <h1>${data.title || data.name}</h1>

        <p>${data.overview}</p>

        <h2>Cast</h2>
        <div class="cast">
            ${credits.cast.slice(0, 10).map(actor => `
                <div class="actor">
                    <img src="${IMG_URL + actor.profile_path}">
                    <p>${actor.name}</p>
                </div>
            `).join("")}
        </div>
    `;
}

loadDetails();