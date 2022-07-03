const fs = require("fs").promises;
const countriesData = require("../public/ressources/countries.json");
const monthsData = require("../public/ressources/months.json");
const daysData = require("../public/ressources/days.json");

const findCountryName = function (cca2) {
    for (country of countriesData) {
      if (country.cca2 === cca2) {
        return country.name.common;
      }
    }
  };

  const findcca2 = function (countryName) {
    for (country of countriesData) {
      if (country.common.name === countryName) {
        return country.cca2;
      }
    }
  };
  
  const findSubRegion = function (cca2) {
    for (country of countriesData) {
      if (country.cca2 === cca2) {
        return country.subregion;
      }
  }}
  
  const scopeAM = ["Caribbean", "Central America", "South America", "North America"];
  const scopeAP = ["Southern Asia", "Polynesia","Australia and New Zealand", "South-Eastern Asia", "Eastern Asia", "Melanesia", "Micronesia"];
  
  const findResponsibleTenderOffice = function (cca2) {
    for (country of countriesData) {
      if (country.cca2 === cca2) {
        if (scopeAM.includes(country.subregion)) {
          return "AM";
        } else if (scopeAP.includes(country.subregion)) {
          return "AP";
        } else {
          return "EU";
        }
    }
  }};

  const currentDateAndTime = function () {
    return new Date(Date.now());
  };

  const formatDate = function (date) {
    let weekDay = date.getDay();
    weekDay = daysData[weekDay];
    let day = date.getDate();
    let month = date.getMonth() + 1;
    month = monthsData[month];
    let year = date.getFullYear();
    if (day < 10) {
      day = "0" + day;
    }
    return `${day}-${month}-${year} (${weekDay}.)`;
  }

// ------ Below is a function to calculate days and dates in the future
const calculateDateAndTime = function (number) {
  let now = new Date(Date.now());
  if (!number || typeof number !== "number") {
      return now
  }
  let someDate = new Date()
  let numberOfDaysToAdd = number
  return new Date(now.setDate(someDate.getDate() + numberOfDaysToAdd))
};

  const capitalize = function (string) {
    return `${string.charAt(0).toUpperCase()}${string.slice(1)}`
  }


const daysDifference = function (date_1, date_2) {
  let difference = date_1.getTime() - date_2.getTime();
  let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
  return TotalDays;
}

const deleteFile = async function (fullFilePath) {
  await fs.unlink(`${fullFilePath}`, function (err) {
    if (err) {
        console.error(err)
        return
    }
    })
}

  module.exports = {
    findCountryName,
    findcca2,
    findSubRegion,
    findResponsibleTenderOffice,
    currentDateAndTime,
    formatDate,
    calculateDateAndTime,
    capitalize,
    daysDifference,
    deleteFile
  }
