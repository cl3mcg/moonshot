const countriesData = require("../public/ressources/countries.json");

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

module.exports = findCountryName
module.exports = findcca2
module.exports = findSubRegion
module.exports = findResponsibleTenderOffice
module.exports = currentDateAndTime