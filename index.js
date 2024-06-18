let state = {
  rawData: [],
  filtered: [],
  currentFilters: {
    name: "",
    state: "",
    type: "",
    city: [],
    pageNum: 1,
    pageCount: null,
  },
};

async function retrieveData() {
  try {
    const response = await fetch(
      "https://api.openbrewerydb.org/v1/breweries?per_page=200"
    );
    const fetchedData = await response.json();
    return fetchedData;
  } catch (error) {
    console.error(error);
  }
}

async function initialise() {
  state.rawData = await retrieveData();
  const breweryTypes = ["micro", "regional", "brewpub"];
  for (let i = 0; i < state.rawData.length; i++) {
    if (breweryTypes.includes(state.rawData[i].brewery_type)) {
      state.filtered.push(state.rawData[i]);
    }
  }

  const stateInput = document.querySelector("#select-state-form");
  stateInput.addEventListener("submit", (event) => {
    event.preventDefault();
    state.currentFilters.pageNum = 1;
    let userInput = document.querySelector("#select-state").value;
    if (!userInput) {
      alert("Please enter a state!");
      state.currentFilters.state = "";
      renderPage();
    } else {
      userInput = userInput[0].toUpperCase() + userInput.slice(1);
      state.currentFilters.state = userInput;
      renderPage();
    }
  });

  const typeInput = document.querySelector("#filter-by-type-form");
  typeInput.addEventListener("change", () => {
    state.currentFilters.pageNum = 1;
    state.currentFilters.type = document.querySelector("#filter-by-type").value;
    if (document.querySelector("#filter-by-type").value === "") {
      state.currentFilters.type = "";
    }
    renderPage();
  });

  const nameInput = document.querySelector("#search-name");
  nameInput.addEventListener("input", () => {
    state.currentFilters.pageNum = 1;
    if (nameInput.value === "") {
      state.currentFilters.name = "";
    } else {
      state.currentFilters.name = document
        .querySelector("#search-name")
        .value.toLowerCase();
    }
    renderPage();
  });

  const cityInput = document.querySelector("#filter-by-city-form");
  cityInput.addEventListener("input", () => {
    state.currentFilters.pageNum = 1;
    const selectedCities = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    );
    const selectedCitiesArray = Array.from(selectedCities).map(
      (checkbox) => checkbox.value
    );
    state.currentFilters.city = selectedCitiesArray;
    renderPage();
  });

  const pageForward = document.querySelector("#page-forward");
  pageForward.addEventListener("click", () => {
    state.currentFilters.pageNum++;
    if (state.currentFilters.pageNum > state.currentFilters.pageCount) {
      state.currentFilters.pageNum--;
    }
    renderPage();
  });

  const pageBack = document.querySelector("#page-back");
  pageBack.addEventListener("click", () => {
    state.currentFilters.pageNum--;
    if (state.currentFilters.pageNum <= 0) {
      state.currentFilters.pageNum = 1;
    }
    renderPage();
  });

  renderCities();
  document.querySelector("#pagination-controls").style.display = "none";
}

function renderCities() {
  let allCities = [];
  for (let i = 0; i < state.rawData.length; i++) {
    if (!allCities.includes(state.rawData[i].city)) {
      allCities.push(state.rawData[i].city);
    }
  }
  allCities.sort();
  const citiesForm = document.querySelector("#filter-by-city-form");
  for (let i = 0; i < allCities.length; i++) {
    const checkboxLabel = document.createElement("label");
    checkboxLabel.classList.add("city-checkbox");
    const formCheckbox = document.createElement("input");
    formCheckbox.setAttribute("type", "checkbox");
    formCheckbox.setAttribute("name", "city");
    formCheckbox.setAttribute("value", allCities[i]);
    checkboxLabel.appendChild(formCheckbox);
    const checkboxText = document.createElement("p");
    checkboxText.textContent = allCities[i];
    checkboxLabel.appendChild(checkboxText);
    citiesForm.appendChild(checkboxLabel);
  }
}

function renderPage() {
  currentData = [];
  document.querySelector("#breweries-list").innerHTML = "";
  document.querySelector("#page-nums").innerHTML = "";

  for (let i = 0; i < state.filtered.length; i++) {
    let thisBrewery = state.filtered[i];
    let correctData = false;
    if (state.currentFilters.state !== "") {
      if (thisBrewery.state_province === state.currentFilters.state) {
        correctData = true;
      } else {
        continue;
      }
    }

    if (state.currentFilters.type !== "") {
      if (thisBrewery.brewery_type === state.currentFilters.type) {
        correctData = true;
      } else {
        continue;
      }
    }

    if (state.currentFilters.name !== "") {
      if (thisBrewery.name.toLowerCase().includes(state.currentFilters.name)) {
        correctData = true;
      } else {
        continue;
      }
    }

    if (state.currentFilters.city.length > 0) {
      if (state.currentFilters.city.includes(thisBrewery.city)) {
        correctData = true;
      } else {
        continue;
      }
    }

    if (correctData) {
      currentData.push(thisBrewery);
    }
  }
  document.querySelector("#pagination-controls").style.display = "flex";
  state.currentFilters.pageCount = Math.ceil(currentData.length / 10);
  for (let i = 1; i <= state.currentFilters.pageCount; i++) {
    const pageIcon = document.createElement("p");
    pageIcon.classList.add("page");
    pageIcon.textContent = i;
    document.querySelector("#page-nums").appendChild(pageIcon);
  }

  let startingIndex = 10 * (state.currentFilters.pageNum - 1);
  let paginatedContent = currentData.slice(startingIndex, startingIndex + 10);

  for (let item in paginatedContent) {
    renderCard(paginatedContent[item]);
  }
}

function renderCard(brewery) {
  const newCard = document.createElement("li");

  const heading = document.createElement("h2");
  heading.textContent = brewery.name;
  newCard.appendChild(heading);
  const type = document.createElement("div");
  type.classList.add("type");
  type.textContent = brewery.brewery_type;
  newCard.appendChild(type);

  const addressElement = document.createElement("section");
  addressElement.classList.add("address");
  const addressHeading = document.createElement("h3");
  addressHeading.textContent = "Address:";
  addressElement.appendChild(addressHeading);
  const addressLine1 = document.createElement("p");
  addressLine1.textContent = brewery.address_1;
  addressElement.appendChild(addressLine1);
  if (brewery.address_2 !== null) {
    const addressLine2 = document.createElement("p");
    const addressLine2_content = document.createElement("strong");
    addressLine2_content.textContent = brewery.address_2;
    addressLine2.appendChild(addressLine2_content);
    addressElement.appendChild(addressLine2);
  }
  newCard.appendChild(addressElement);

  const phoneElement = document.createElement("section");
  phoneElement.classList.add("phone");
  const phoneHeading = document.createElement("h3");
  phoneHeading.textContent = "Phone:";
  phoneElement.appendChild(phoneHeading);
  const phoneContent = document.createElement("p");
  phoneContent.textContent = brewery.phone;
  phoneElement.appendChild(phoneContent);
  newCard.appendChild(phoneElement);

  const linkSection = document.createElement("section");
  linkSection.classList.add("link");
  const linkElement = document.createElement("a");
  linkElement.textContent = "Visit Website";
  linkElement.setAttribute("target", "_blank");
  linkElement.setAttribute("href", brewery.website_url);
  linkSection.appendChild(linkElement);
  newCard.appendChild(linkSection);

  document.querySelector("#breweries-list").appendChild(newCard);
}

initialise();
