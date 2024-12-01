document.addEventListener("DOMContentLoaded", () => {
    let conteinor = document.querySelector(".conteinor");
    let darkMode = document.querySelector(".dark-mode");
    let laykMode = document.querySelector(".light-mode");
    let body = document.body;
    let select = document.querySelector("#select");
    let search = document.querySelector("#search");

    darkMode.style.display = "block";
    laykMode.style.display = "none";

    const regions = ["all", "Africa", "Americas", "Asia", "Europe", "Oceania"];
    regions.forEach(region => {
        let option = document.createElement("option");
        option.value = region.toLowerCase();
        option.textContent = region;
        select.append(option);
    });

    async function fetchCountries() {
        try {
            let response = await fetch("https://restcountries.com/v3.1/all");
            let countries = await response.json();
            displayCountries(countries);
        } catch (error) {
            console.error("Error fetching countries:", error);
        }
    }

    function displayCountries(data) {
        conteinor.innerHTML = "";
        data.forEach(elem => {
            let card = document.createElement("div");
            card.classList.add("card");
            let img = document.createElement("img");
            img.src = elem.flags?.png || "default-flag.png";
            let name = document.createElement("h2");
            name.textContent = elem.name?.common || "No name";
            let population = document.createElement("p");
            population.textContent = `Population: ${elem.population}`;
            let region = document.createElement("p");
            region.textContent = `Region: ${elem.region}`;
            let capital = document.createElement("p");
            capital.textContent = `Capital: ${elem.capital?.[0] || "N/A"}`;
            card.append(img, name, population, region, capital);
            conteinor.append(card);

            card.addEventListener("click", () => {
                window.location.replace(`card.html?name=${elem.name.common}`);
            });
        });
    }


    search.addEventListener("input", async (e) => {
        let query = e.target.value.trim().toLowerCase();
        if (query === "") {
            fetchCountries(); 
            return;
        }

        try {
            let res = await fetch(`https://restcountries.com/v3.1/name/${query}`);
            if (!res.ok) throw new Error("Davlat ma'lumotlarini olishda xatolik");
            let data = await res.json();
            displayCountries(data);
        } catch (error) {
            console.error("Qidiruvda xatolik:", error);
            conteinor.innerHTML = `<p class="error">Natija topilmadi</p>`;
        }
    });

    select.addEventListener("change", async (e) => {
        let region = e.target.value;
        let url = region === "all"
            ? "https://restcountries.com/v3.1/all"
            : `https://restcountries.com/v3.1/region/${region}`;

        try {
            let res = await fetch(url);
            if (!res.ok) throw new Error("Ma'lumot olishda xatolik");
            let data = await res.json();
            displayCountries(data);
        } catch (error) {
            console.error("Mintaqalar bo‘yicha ma'lumotni olishda xatolik:", error);
        }
    });

    darkMode.addEventListener("click", () => {
        body.style.backgroundColor = "#202D36";
        darkMode.style.display = "none";
        laykMode.style.display = "block";
        document.querySelectorAll(".card").forEach(card => {
            card.style.backgroundColor = "#2B3743";
            card.style.color = "white";
        });
    });

    laykMode.addEventListener("click", () => {
        body.style.backgroundColor = "aliceblue";
        laykMode.style.display = "none";
        darkMode.style.display = "block";
        document.querySelectorAll(".card").forEach(card => {
            card.style.backgroundColor = "white";
            card.style.color = "black";
        });
    });

    fetchCountries();

});
