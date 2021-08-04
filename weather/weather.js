//function to create new DOM Element
var createNewElement = (elementName) =>{
    return document.createElement(elementName)
}

//function to set attributes to DOM Element
var setAttributes = (elementName,attributeNameValuePair)=>{
    Object.keys(attributeNameValuePair).forEach((attributeName)=>{
        elementName.setAttribute(attributeName,attributeNameValuePair[attributeName])
    })
}


//creating card-deck element
var cardDeckElem = createNewElement("div")
setAttributes(cardDeckElem,{
    class:"container mt-5 d-flex flex-wrap justify-content-around bg-dark p-4"
})

//using async-await and fetch to get rest countries data
async function getCountriesData(){
    try{
        var countriesDataRequest = await fetch("https://restcountries.eu/rest/v2/all")
        var countriesData = await countriesDataRequest.json()
        return countriesData
    }
    catch(err){ return err }
}

//stores all the country-flag card elements
var countryCards = []

//using .then to access rest-countries response data
getCountriesData().then((countriesData)=>{

    console.log(countriesData)

    //creating country-flag cards
    for(var i=0;i<countriesData.length;i++){
        countryCards.push(createNewElement("div"))
        setAttributes(countryCards[i],{
            class:"card mb-4 p-2 text-center",
            style:"width:250px; box-shadow: 0px 10px 10px black; background-color:goldenblack;"
        })
        
        //to display country name and flag at top in each card
        countryCards[i].innerHTML = `<p class="bg-dark text-white"> <b> ${countriesData[i].name} </b> </p> 
        <img class="border card-img-top" src="${countriesData[i].flag}" alt="${countriesData[i].name} Flag">`
        
        //creating card-body element for country details
        var cardBodyElem = createNewElement("div")
        setAttributes(cardBodyElem,{class:"card-body"})

        if(countriesData[i].capital==="") {countriesData[i].capital="-"}
        if(countriesData[i].alpha2Code==="") {countriesData[i].alpha2Code="-"}
        if(countriesData[i].alpha3Code==="") {countriesData[i].alpha3Code="-"}
        if(countriesData[i].region==="") {countriesData[i].region="-"}
        if(countriesData[i].latlng.length===0) {countriesData[i].latlng = ['-','-']}
        
        //to display capital name
        var capitalElem = createNewElement("p")
        setAttributes(capitalElem,{class:"class-text capital"})
        capitalElem.innerHTML = `Capital: <span class="text-white rounded p-1" style="background-color:green"> 
        ${countriesData[i].capital} </span>`

        //to display country-region 
        var regionElem = createNewElement("p")
        setAttributes(regionElem,{class:"class-text"})
        regionElem.innerHTML = `Region: <b>${countriesData[i].region}`
        
        //to display country code
        var countryCodeElem = createNewElement("p")
        setAttributes(countryCodeElem,{class:"class-text"})
        countryCodeElem.innerHTML = `Country Code: <b>${countriesData[i].alpha2Code}, ${countriesData[i].alpha3Code}</b>`
        
        //to display latitude and longitude values
        var latlngElem = createNewElement("p")
        setAttributes(latlngElem,{class:"latlng class-text"})
        latlngElem.innerHTML = `Lat,Lng: <b>${countriesData[i].latlng[0]}, ${countriesData[i].latlng[1]}</b>`

        //to display button -> onclick shows weather data
        var weatherButtonElem = createNewElement("button")
        setAttributes(weatherButtonElem,{
            class:"btn btn-info"
        })
        weatherButtonElem.innerText = "Click for Weather"
        weatherButtonElem.addEventListener('click',displayWeatherData)

        //appending elements to card-body    
        cardBodyElem.append(capitalElem,regionElem,countryCodeElem,latlngElem,weatherButtonElem)

        //appending card-body to country-flag card
        countryCards[i].append(cardBodyElem)
    }

    //appending all the country-flag cards to card-deck
    cardDeckElem.append(...countryCards)
})
.catch((errormsg)=>{
    console.log(errormsg)
})

//weather-button onclick function to show weather data
async function displayWeatherData(event){
    try{
        //to get card-body element of each cards
        var eventParentElem = event.target.parentElement
        
        //to get lat and lng values from latlngElem of card-body
        var [lat,lng] = eventParentElem.querySelector(".latlng").innerText.slice(9).split(", ")

        //getting weather data by lat and lng values
        var apiKey = `eb1248bbe7e3c47a06bd14ab181a98e0`
        var url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}`
        var weatherDataRequest = await fetch(url)
        var weatherData = await weatherDataRequest.json()

        var weatherDataString = `Weather: <br>temperature: <b>${weatherData.main.temp} </b> <br>
        description: <b>${weatherData.weather[0].description} </b> <br> wind-speed: <b>${weatherData.wind.speed} </b>`
    }
    catch(err){
        weatherDataString= `Weather: <b>Data not available</b>`
    }
    
    //to remove get-weather data button
    eventParentElem.removeChild(event.target.parentElement.querySelector(".btn"))

    var weatherElem = createNewElement("p")
    setAttributes(weatherElem,{class:"class-text"})
    weatherElem.innerHTML = weatherDataString
    eventParentElem.append(weatherElem)
}


//appending card-deck element with all the country-flag cards to the body
document.body.append(cardDeckElem)