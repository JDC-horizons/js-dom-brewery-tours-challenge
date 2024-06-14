let state = {
  rawData: [],
  filtered: [],
  currentFilters: {
    name: null,
    state: null,
    type: null,
    city: [],
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
    let userInput = document.querySelector("#select-state").value;
    if (!userInput) {
      alert("Please enter a state!");
    }
    userInput = userInput[0].toUpperCase() + userInput.slice(1);
    state.currentFilters.state = userInput;
    renderPage();
  });
  const typeInput = document.querySelector("#filter-by-type-form");
  typeInput.addEventListener("change", () => {
    state.currentFilters.type = document.querySelector("#filter-by-type").value;
    renderPage();
  });
  const nameInput = document.querySelector("#search-name");
  nameInput.addEventListener("input", () => {
    if (nameInput.value === "") {
      state.currentFilters.name = null;
    } else {
      state.currentFilters.name = document.querySelector("#search-name").value;
    }
    renderPage();
  });
}

function renderPage() {
  currentData = [];
  document.querySelector("#breweries-list").innerHTML = "";
  if (
    state.currentFilters.name === null &&
    state.currentFilters.state === null &&
    state.currentFilters.type === null &&
    state.currentFilters.city.length === 0
  ) {
    for (let brewery in state.filtered) {
      currentData.push(state.filtered[brewery]);
    }
  } else {
    for (let brewery in state.filtered) {
      let currentBrewery = state.filtered[brewery];
      if (
        currentBrewery.name
          .toLowerCase()
          .includes(state.currentFilters.name.toLowerCase()) ||
        currentBrewery.state_province === state.currentFilters.state ||
        currentBrewery.brewery_type === state.currentFilters.type ||
        state.currentFilters.city.includes(currentBrewery.city)
      ) {
        currentData.push(state.filtered[brewery]);
      }
    }
    for (let item in currentData) {
      renderCard(currentData[item]);
    }
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
