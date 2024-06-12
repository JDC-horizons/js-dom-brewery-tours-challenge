let state = {
    rawData: [{
        id: '5128df48-79fc-4f0f-8b52-d06be54d0cec',
        name: '(405) Brewing Co',
        brewery_type: 'micro',
        address_1: '1716 Topeka St',
        address_2: null,
        address_3: null,
        city: 'Norman',
        state_province: 'Oklahoma',
        postal_code: '73069-8224',
        country: 'United States',
        longitude: '-97.46818222',
        latitude: '35.25738891',
        phone: '4058160490',
        website_url: 'http://www.405brewing.com',
        state: 'Oklahoma',
        street: '1716 Topeka St'
      }],
    filteredData: [],
    current: [],
    filters: []
}

async function retrieveData() {
    try {
        const response = await fetch("https://api.openbrewerydb.org/v1/breweries");
        const fetchedData = await response.json();
        state.rawData = fetchedData 
      }  catch (error) {
        console.error(error);
      }
}

function renderCard(brewery) {
    const newCard = document.createElement('li')

    const heading = document.createElement('h2')
      heading.textContent = brewery.name
      newCard.appendChild(heading)
    const type = document.createElement('div')
      type.classList.add('type')
      type.textContent = brewery.brewery_type
      newCard.appendChild(type)

    const addressElement = document.createElement('section')
    addressElement.classList.add('address')
      const addressHeading = document.createElement('h3')
        addressHeading.textContent = 'Address:'
        addressElement.appendChild(addressHeading)
      const addressLine1 = document.createElement('p')
        addressLine1.textContent = brewery.address_1
        addressElement.appendChild(addressLine1)
      if (brewery.address_2 !== null) {
        const addressLine2 = document.createElement('p')
        const addressLine2_content = document.createElement('strong')
        addressLine2_content.textContent = brewery.address_2
        addressLine2.appendChild(addressLine2_content)
        addressElement.appendChild(addressLine2)
      }
      newCard.appendChild(addressElement)

      const phoneElement = document.createElement('section')
      phoneElement.classList.add('phone')
        const phoneHeading = document.createElement('h3')
          phoneHeading.textContent = 'Phone:'
          phoneElement.appendChild(phoneHeading)
        const phoneContent = document.createElement('p')
          phoneContent.textContent = brewery.phone
          phoneElement.appendChild(phoneContent)
          newCard.appendChild(phoneElement)
      
      const linkSection = document.createElement('section')
        linkSection.classList.add('link')
        const linkElement = document.createElement('a')
        linkElement.textContent = 'Visit Website'
          linkElement.setAttribute('target', '_blank')
          linkElement.setAttribute('href', brewery.website_url)
          linkSection.appendChild(linkElement)
        newCard.appendChild(linkSection)
    
        document.querySelector('#breweries-list').appendChild(newCard)
}

// retrieveData()
renderCard(state.rawData[0])
