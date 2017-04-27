var nationalData = {};
var countyData = {};

var CrimeLabels = {
  MURDER: "Murder",
  RAPE: "Rape",
  ROBBERY: "Robbery",
  ASSAULT: "Aggravated Assault",
  BURGLARY: "Burglary",
  LARCENY: "Larceny-Theft",
  VEHICLE: "Motor Vehicle Theft",
};

// ------------Crime Rate Functions----------------
function getCounty(county){
  //return the following object:
  /*
    "geoid":
    {
      "geoid": #####,
      "state": "String"
      "abbreviation": "String"

      "population": ####,

      "male": #.##,
      "female": #.##,

      "income": ##,###,

      "white": #.##,
      "black": #.##,
      "native": #.##,
      "asian": #.##,
      "hawaiian": #.##,
      "other": #.##,
      "mixed": #.##,

      "violent": #.##,
      "property": #.##,

      "murder": #.##,
      "rape": #.##,
      "robbery": #.##,
      "assault": #.##,
      "burglary": #.##,
      "larceny": #.##,
      "vehicle": #.##
    }
  */
  //return the crime rante of a given county and crime

  var countyObject = countyData[county];
  return countyObject;
}

function getCounties(state){
  //return an an array of each county in a given state
  counties = [];
  //will need to do a for loop for each county in a given state
  //var state = countyData.filter(obj => obj['state'] == state);
  return counties;
}

function getCounties(){
  //return an array with all counties in the US
  return countyData;
}

//county crime data
d3.json("countyData.json", function(data) {
  countyData = data;
  county = countyData["1001"];
  window.alert(county["county"]+"\'s population is "+county["population"]);
});

//national data with states and US total
d3.json("nationalData.json", function(data) {
  nationalData = data;
  state = nationalData["AL"];
  window.alert(state["state"]+"\'s population is "+state["population"]);
});
