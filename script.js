var nationalData = [];
var countyData = {};

var Labels = {
  MURDER: "Murder and nonnegligent manslaughter",
  LEGACY_RAPE: "Legacy rape",
  REVISED_RAPE: "Revised rape",
  ROBBERY: "Robbery",
  ASSAULT: "Aggravated assault",
  BURGLARY: "Burglary",
  LARCENY: "Larceny-theft",
  MOTOR_VEHICLE: "Motor vehicle theft",
};

var CrimeLabels = {
  VIOLENT_CRIME_TOTAL: "Violent crime total",
  MURDER: "Murder and nonnegligent manslaughter",
  LEGACY_RAPE: "Legacy rape",
  REVISED_RAPE: "Revised rape",
  ROBBERY: "Robbery",
  ASSAULT: "Aggravated assault",
  PROPERTY_CRIME_TOTAL: "Property crime total",
  BURGLARY: "Burglary",
  LARCENY: "Larceny-theft",
  MOTOR_VEHICLE: "Motor vehicle theft",
  VIOLENT_CRIME_RATE: "Violent Crime rate",
  MURDER_RATE: "Murder and nonnegligent manslaughter rate",
  LEGACY_RAPE_RATE: "Legacy rape rate",
  REVISED_RAPE_RATE: "Revised rape rate",
  ROBBERY_RATE: "Robbery rate",
  ASSAULT_RATE: "Aggravated assault rate",
  PROPERTY_CRIME_RATE: "Property crime rate",
  BURGLARY_RATE: "Burglary rate",
  LARCENY: "Larceny-theft rate",
  MOTOR_VEHICLE_RATE: "Motor vehicle theft rate"
};

// ------------Crime Rate Functions----------------
function getCounty(county){
  //return the following object:
  /*
    geoid:
    {
      "id": #####,
      "name": "String"

      "population": ###,
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
  //return the crime rate of a given county and crime

  var countyObject = countyData[county];
  return countyObject;
}

function getCounties(state){
  //return an an array of each county in a given state

  //will need to do a for loop for each county in a given state
  var state = countyData.filter(obj => obj['state'] == state);
  return state;
}

function getCounties(){
  //return an array with all counties in the US
  return countyData;
}

//county crime data
d3.csv("MegaFile.csv", function(data) {
  data.forEach(function(d) {
    var geoid = d['geoid'];
    var county = JSON.parse(JSON.stringify(d));
    countyData[geoid] = county;
  });
  
  county = getCounty("1001");
  window.alert(county['name']);
});
